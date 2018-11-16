import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { TabsPage } from "../pages/tabs/tabs";
import { FeedPage } from "../pages/feed/feed";
import { PharmacyPage } from "./../pages/patient-info/pharmacy/pharmacy";
import { PatientInfoPage } from "./../pages/patient-info/patient-info";
import { MedicalHistoryPage } from "./../pages/patient-info/medical-history/medical-history";
import { PatientSimptomPage } from "./../pages/patient-info/patient-simptom/patient-simptom";
import { BodyMeasurementsPage } from "./../pages/patient-info/body-measurements/body-measurements";
import { MedicalHistoryPhase3Page } from "./../pages/patient-info/medical-history/medical-history-phase3/medical-history-phase3";
import { VitalsPage } from "./../pages/patient-info/vitals/vitals";
import { HttpClient } from "@angular/common/http";
import { DoctorProfilePage } from "./../pages/doctor-profile/doctor-profile";
import { ProfilePage } from "./../pages/profile/profile";
import { AdjustmentsPage } from "./../pages/adjustments/adjustments";
import { Config } from "./app.config";
import { PharmacyMapPage } from "./../pages/patient-info/pharmacy/pharmacy-map/pharmacy-map";
declare let cordova: any;
declare let localStorage: any;
declare let Media: any;

declare let navigator: any;
declare let RTCPeerConnection: any;

declare let window: any;

import * as io from "socket.io-client";
let socket;
let self;
let audio;

let peerConnection;
let peerConnectionConfig: any;

peerConnectionConfig = {
  iceServers: [
    {
      url: "stun:global.stun.twilio.com:3478?transport=udp"
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "a0897b157e239be554d549ad258aed7f181cdb96cc1d2712704dee6bc093e498",
      credential: "/oGv5lQHgZUiST6GnHb5HlDokRePjDMQlcPVEsxw0zU="
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=tcp",
      username:
        "a0897b157e239be554d549ad258aed7f181cdb96cc1d2712704dee6bc093e498",
      credential: "/oGv5lQHgZUiST6GnHb5HlDokRePjDMQlcPVEsxw0zU="
    },
    {
      url: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "a0897b157e239be554d549ad258aed7f181cdb96cc1d2712704dee6bc093e498",
      credential: "/oGv5lQHgZUiST6GnHb5HlDokRePjDMQlcPVEsxw0zU="
    }
  ]
};
  
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;
  //rootPage:any = VitalsPage;
  pages: any;
  avatar = "assets/img/marty-avatar.png";
  user = { firstName: "", lastName: "" };
  channels = [];
  isCall = false;
  option = {
    video: true,
    audio: true
  };
  localStream = null;
  remoteStream = null;
  receive: any;
  currentUser: any;

  public feedPage = "Feed";
  public aboutPage = "About";
  public contactPage = "Contact";
  public ProfilePage = "Mi Perfil";
  public AdjustmentsPage = "Ajustes";

  constructor(
    public events: Events,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private http: HttpClient
  ) {
    self = this;
    events.subscribe("user:update", user => {
      this.user.firstName = user.firstName;
      this.user.lastName = user.lastName;
      this.avatar = user.avatar;
    });

    platform.ready().then(() => {
      this.main_navigation();
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.socketCreation();

    events.subscribe("webrtc", message => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      self.receive = message.receiveUser;
      self.option = message.option;
      self.isCall = true;
      self._callVideo(message);
      if (window.cordova) {
        audio.play();
      }
    });

    events.subscribe("socket", () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      self.socketCreation();
    });

    // document.addEventListener("deviceready", function() {
    //   if (platform.is("ios")) {
    //     cordova.plugins.iosrtc.registerGlobals();
    //     console.log(cordova.plugins.iosrtc);
    //     // load adapter.js
    //   }
    // });

    setTimeout(() => {
      if (window.cordova) {
        cordova.plugins.iosrtc.registerGlobals();

        audio = new Media(
          "https://futucare.com/demo/assets/skype_ring.mp3",
          // success callback
          function() {
            console.log("playAudio():Audio Success");
          },
          // error callback
          function(err) {
            console.log("playAudio():Audio Error: " + err);
          }
        );

        if (platform.is("ios")) {
          cordova.plugins.audioroute.overrideOutput(
            "speaker",
            function(success) {
              console.log("success", success);
              // Success
            },
            function(error) {
              console.log("error", error);

              // Error
            }
          );
        }

        var notificationOpenedCallback = function(jsonData) {
          console.log(
            "notificationOpenedCallback: " + JSON.stringify(jsonData)
          );
        }; 

        window["plugins"].OneSignal.startInit(Config.oneSignalAppId)
          .inFocusDisplaying(
            window.plugins.OneSignal.OSInFocusDisplayOption.Notification
          )
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
    }, 10000);
  }

  socketCreation() {
    let currentUser = JSON.parse(localStorage.getItem("user_data"));
    this.currentUser = currentUser;
    if (this.currentUser && !this.currentUser.name) {
      this.currentUser.name =
        this.currentUser.firstName + " " + this.currentUser.lastName;
    }
    if (currentUser) {
      socket = io.connect("https://futucare.com");
      console.log("1");
      socket.on("message:save", doc => {
        if (currentUser && currentUser._id != doc.from.userId) {
          self.events.publish("message", doc);
          if (window.codova) {
            console.log("111111");
          }
        }
      });

      socket.on("channel:save", doc => {
        let isCheck = false;
        let index = 0;
        for (let i = 0; i < self.channels.length; i++) {
          for (let j = 0; j < self.channels[i].users.length; j++) {
            if (self.channels[i].users[j].user._id == currentUser._id) {
              isCheck = true;
              index = i;
              break;
            }
          }
        }

        if (isCheck) {
          self.http
            .post(Config.url + Config.api.messenger.detailChannel, {
              channel: self.channels[index]._id
            })
            .subscribe(data => {
              let read = 0;
              let channel = <any>data;
              channel = channel.data;
              channel.userShow = {};
              for (let j = 0; j < channel.users.length; j++) {
                if (channel.users[j]._id != currentUser._id) {
                  channel.userShow = channel.users[j];
                } else {
                  read = channel.users[j].read;
                }
              }
              channel.userShow.read = read;
              self.channels[index] = channel;
              self.events.publish("channel", self.channels);
            });
        }
      });

      socket.on("webrtc:save", message => {
        console.log("message", message, self.currentUser);
        if (!message.to) {
          message.to = {};
        }
        if (message.status == 2 && self.currentUser._id == message.to._id) {
          self.gotMessageFromServer(message);
        }

        if (message.status == 3 && self.currentUser._id == message.to._id) {
          self.closeCallUser(null, true);
        }
        if (message.status == 1 && self.currentUser._id == message.to._id) {
          self.receive = message.from;
          self.option = message.option;
          self.isCall = true;
          if (window.cordova) {
            audio.play();
          }
        }

        if (message.status == 4 && self.currentUser._id == message.to._id) {
          self.modalVideo = false;
        }
      });

      if (!currentUser) {
        return;
      }
      this.http.get(Config.api.messenger.turn).subscribe(response => {
        peerConnectionConfig.iceServers = response;
      });
      this.http
        .get(Config.url + Config.api.messenger.channel, {
          params: {
            userId: currentUser._id
          }
        })
        .subscribe(data => {
          self.channels = data;
          let read = 0;
          for (let i = 0; i < self.channels.length; i++) {
            self.channels[i].userShow = {};
            for (let j = 0; j < self.channels[i].users.length; j++) {
              if (self.channels[i].users[j]._id != currentUser._id) {
                self.channels[i].userShow = self.channels[i].users[j];
              } else {
                read = self.channels[i].users[j].read;
              }
            }
            self.channels[i].userShow.read = read;
          }

          self.events.publish("channel", self.channels);
        });

      setTimeout(() => {
        if (!window.cordova) {
          return;
        }
        console.log("notification", 1111111);
        window.plugins.OneSignal.getPermissionSubscriptionState(function(
          status
        ) {
          console.log(status);
          status.subscriptionStatus.userId; // String: OneSignal Player ID
          status.subscriptionStatus.pushToken; // String: Device Identifier from FCM/APNs
          if (
            localStorage.getItem("pushUserId") !=
            status.subscriptionStatus.userId
          ) {
            self.http
              .put(Config.url + Config.api.user.update + currentUser._id, {
                pushToken: status.subscriptionStatus.pushToken,
                userPush: status.subscriptionStatus.userId
              })
              .subscribe(data => {
                console.log("data", data);
                localStorage.setItem(
                  "pushUserId",
                  status.subscriptionStatus.userId
                );
              });
          }
        });
      }, 5000);
    }
  }

  main_navigation() {
    this.pages = [
      { icon: "ios-contact", title: this.ProfilePage, component: ProfilePage },
      {
        icon: "ios-settings",
        title: this.AdjustmentsPage,
        component: AdjustmentsPage
      }
    ];
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  getProfile() {
    let currentUser = JSON.parse(localStorage.getItem("user_data"));
    this.nav.setRoot(ProfilePage, { _id: currentUser._id });
  }

  _callVideo(message, isConnecting) {
    if (self.platform.is("ios")) {
      cordova.plugins.iosrtc.getUserMedia(
        // constraints
        message.option,
        // success callback
        function(stream) {
          self.localStream = stream;
          self.localStream.src = window.URL.createObjectURL(stream);
          if (!isConnecting) {
            self.http
              .post(Config.api.messenger.webrtc, {
                to: message.receiveUser,
                status: 1,
                from: self.currentUser,
                option: message.option
              })
              .subscribe(res => {});
          } else {
            self.connect(true);
          }

          if (window.cordova) {
            setTimeout(() => {
              cordova.plugins.iosrtc.refreshVideos();
            }, 1000);
          }
        },
        // failure callback
        function(error) {
          console.error("getUserMedia failed: ", error);
        }
      );
    } else {
      navigator.webkitGetUserMedia(
        message.option,
        function(stream) {
          self.localStream = stream;
          self.localStream.src = window.URL.createObjectURL(stream);
          if (!isConnecting) {
            self.http
              .post(Config.api.messenger.webrtc, {
                to: message.receiveUser,
                status: 1,
                from: self.currentUser,
                option: message.option
              })
              .subscribe(res => {});
          } else {
            self.connect(true);
          }

          if (window.cordova) {
            setTimeout(() => {
              cordova.plugins.iosrtc.refreshVideos();
            }, 1000);
          }
        },
        function(e) {
          console.log("No live audio input: " + e);
        }
      );
    }
  }

  startCall() {
    // self.hasCalling = false;
    self._callVideo(
      {
        option: self.option
      },
      true
    );
  }

  connect(isCaller) {
    console.log("peerConnectionConfig", peerConnectionConfig);
    peerConnection = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.onicecandidate = event => self.gotIceCandidate(event);
    peerConnection.onaddstream = stream => self.gotRemoteStream(stream);
    peerConnection.addStream(self.localStream);

    if (isCaller) {
      peerConnection
        .createOffer()
        .then(des => self.createdDescription(des))
        .catch(this.errorHandler);
    }
  }

  gotMessageFromServer(message) {
    let self = this;
    if (!peerConnection) self.connect(false);

    let signal = message;
    // Ignore messages from ourself
    if (signal.to._id == self.receive._id) return;

    if (signal.sdp) {
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(function() {
          // Only create answers in response to offers
          if (signal.sdp.type == "offer") {
            peerConnection
              .createAnswer()
              .then(self.createdDescription)
              .catch(self.errorHandler);
          }
        })
        .catch(this.errorHandler);
    } else if (signal.ice) {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch(self.errorHandler);
    }
  }

  gotIceCandidate(event) {
    if (event.candidate != null) {
      self.http
        .post(Config.api.messenger.webrtc, {
          ice: event.candidate,
          to: self.receive,
          status: 2
        })
        .subscribe(res => {});
    }
  }

  gotRemoteStream(event) {
    self.remoteStream = event.stream;
    self.remoteStream.src = window.URL.createObjectURL(event.stream);
    if (window.cordova) {
      setTimeout(() => {
        cordova.plugins.iosrtc.refreshVideos();
      }, 1000);
    }
  }

  createdDescription(description) {
    peerConnection
      .setLocalDescription(description)
      .then(function() {
        self.http
          .post(Config.api.messenger.webrtc, {
            sdp: peerConnection.localDescription,
            to: self.receive,
            status: 2
          })
          .subscribe(res => {});
      })
      .catch(self.errorHandler);
  }

  errorHandler(error) {}

  stopMediaTrack(stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    stream = null;
  }

  closeCallUser(event, isStop) {
    self.isMuteAudio = false;
    self.isCall = false;

    if (event) {
      event.stopPropagation();
    }

    if (self.localStream) {
      self.stopMediaTrack(self.localStream);
    }
    if (self.remoteStream) {
      self.stopMediaTrack(self.remoteStream);
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    setTimeout(function() {
      self.remoteStream = null;
      self.localStream = null;
      if (window.cordova) {
        cordova.plugins.iosrtc.refreshVideos();
      }
    }, 2000);
    if (!isStop) {
      self.http
        .post(Config.api.messenger.webrtc, {
          to: self.receive,
          status: 3,
          from: self.currentUser
        })
        .subscribe(res => {});
    }
    self.receive = {};
    if (window.cordova) {
      audio.stop();
    }
  }

  muteAudio() {
    self.isMuteAudio = !self.isMuteAudio;
    if (!self.isMuteAudio) {
      self.localStream.getAudioTracks()[0].enabled = true;
    } else {
      self.localStream.getAudioTracks()[0].enabled = false;
    }
  }

  logout() {
    localStorage.clear();
    this.nav.setRoot(LoginPage);
  }
}
