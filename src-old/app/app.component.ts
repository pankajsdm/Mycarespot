import { Component, ViewChild, NgZone } from "@angular/core";
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
import { VisitingCostPage } from "./../pages/patient-info/visiting-cost/visiting-cost";
import { PharmacyMapPage } from "./../pages/patient-info/pharmacy/pharmacy-map/pharmacy-map";
import { Insomnia } from "@ionic-native/insomnia";
import RTCMultiConnection from "rtcmulticonnection";
import $ from "jquery";

declare let cordova: any;
declare let localStorage: any;
declare let Media: any;
let ringCall;
declare let navigator: any;

declare let window: any;

declare let DetectRTC: any;
let room;
let connection;
let iceServers: any = [];

import * as io from "socket.io-client";
let socket;
let self;
let $body = $("body");

let peerConnection;

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;
  //rootPage:any = VisitingCostPage;
  //rootPage:any = VitalsPage;
  pages: any;
  avatar = "assets/img/marty-avatar.png";
  user = { firstName: "", lastName: "" };
  channels = [];
  localVideo: any = null;
  remoteVideo: any = null;
  isCall = false;
  callOption: any = {};
  callOptionReceive: any = {};
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
    private http: HttpClient,
    private insomnia: Insomnia,
    private _ngZone: NgZone
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

    events.subscribe("webrtc", params => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      // self.receive = message.receiveUser;
      // self.option = message.option;
      // self.isCall = true;
      console.log(params);
      self.callOption = params;
      self.openGroupCall();
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
        self.insomnia
          .keepAwake()
          .then(() => console.log("success"), () => console.log("error"));
        cordova.plugins.iosrtc.registerGlobals();

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

        ringCall = new Media(
          "https://s3-us-west-2.amazonaws.com/stove-store/skype_ring.mp3",
          // success callback
          function() {
            console.log("playAudio():Audio Success");
          },
          // error callback
          function(err) {
            console.log("playAudio():Audio Error: " + err);
          }
        );
      }
    }, 3000);
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
        if (message.status == 3 && self.currentUser._id == message.to._id) {
          self.closeCall(true);
        }
        if (message.status == 1 && self.currentUser._id == message.to._id) {
          self._ngZone.run(() => {
            self.callOption = message.option;
            self.callOption.receive = message.from;
            room = message.room;
            self.isCall = true;
          });

          if (window.cordova) {
            ringCall.play();
          }
        }
      });

      if (!currentUser) {
        return;
      }
      self.http.get(Config.webrtc.turn).subscribe(data => {
        console.log(data);
        iceServers = data;
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

  logout() {
    localStorage.clear();
    this.nav.setRoot(LoginPage);
  }

  // Multiple RTC Connection

  _initMultipleConnection() {
    if (connection) {
      connection.leave();
    }
    window.enableAdapter = false;

    connection = new RTCMultiConnection();
    // by default, socket.io server is assumed to be deployed on your own URL
    connection.socketURL = Config.webrtc.rtc;
    console.log("connection.socketURL", connection.socketURL);
    connection.iceServers = iceServers;

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    connection.socketMessageEvent = "video-conference-demo";
    connection.session = self.callOption.option;
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: self.callOption.option.audio,
      OfferToReceiveVideo: self.callOption.option.video
    };

    if (!self.callOption.option.video) {
      connection.mediaConstraints = {
        audio: true,
        video: false
      };
      console.log("11111");
    }
    connection.onstream = function(event) {
      event.src = window.URL.createObjectURL(event.stream);

      if (event.type === "local") {
        if (!self.localVideo) {
          self.localVideo = event;
        }
      } else {
        if (!self.remoteVideo) {
          self._ngZone.run(() => {
            self.remoteVideo = event;
          });

          if (window.cordova) {
            ringCall.stop();
          }
        }
      }
      if (self.platform.is("ios")) {
        setTimeout(() => {
          window.cordova.plugins.audioroute.overrideOutput(
            "speaker",
            function(success) {
              console.log("speaker");
              // Success
            },
            function(error) {
              console.log("error");

              // Error
            }
          );
          window.cordova.plugins.iosrtc.refreshVideos();
        }, 1000);
      }
      console.log("1111", self.localVideo, self.remoteVideo);
    };

    connection.onstreamended = function(event) {
      // var mediaElement = document.getElementById(event.streamid);
      // if (mediaElement) {
      //   mediaElement.parentNode.removeChild(mediaElement);
      // }
    };
    connection.onMediaError = function(e) {
      if (e.message === "Concurrent mic process limit.") {
        if (DetectRTC.audioInputDevices.length <= 1) {
          alert(
            "Please select external microphone. Check github issue number 483."
          );
          return;
        }
        var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        connection.mediaConstraints.audio = {
          deviceId: secondaryMic
        };
        connection.join(connection.sessionid);
      }
    };
  }

  openGroupCall() {
    console.log(self.callOption);
    self.isCall = true;
    self._initMultipleConnection();
    room = self.currentUser._id + "-" + new Date().getTime();

    connection.open(room, function() {
      if (!window.cordova) {
        connection.extra.isDesktop = true;
      }
      connection.updateExtraData();
      self.http
        .post(Config.api.messenger.webrtc, {
          to: self.callOption.receive,
          status: 1,
          from: self.currentUser,
          option: self.callOption,
          room: room
        })
        .subscribe(res => {});

      setInterval(() => {
        if (window.cordova) {
          window.cordova.plugins.iosrtc.refreshVideos();
        }
      }, 2000);
    });

    if (window.cordova) {
      ringCall.play();
    }
  }

  joinMultipleCall() {
    self._initMultipleConnection();
    connection.join(room, function() {
      if (!window.cordova) {
        connection.extra.isDesktop = true;
      }
      connection.updateExtraData();
    });
  }

  _stopMediaTrack(stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    stream = null;
  }

  closeCall(isRemote) {
    if (connection) {
      connection.leave();
    }
    room = null;
    self._ngZone.run(() => {
      self.isCall = false;
    });
    if (self.localVideo) {
      console.log(self.localVideo);
      self._stopMediaTrack(self.localVideo.stream);
      self.localVideo = null;
    }
    if (self.remoteVideo) {
      self._stopMediaTrack(self.remoteVideo.stream);
      self.remoteVideo = null;
    }

    if (!isRemote) {
      self.http
        .post(Config.api.messenger.webrtc, {
          to: self.callOption.receive,
          status: 3,
          from: self.currentUser
        })
        .subscribe(res => {});
    }

    if (window.cordova) {
      ringCall.stop();
    }
  }

  muteAudio() {
    self.isMuted = !self.isMuted;
    console.log(self.isMuted);

    if (!self.platform.is("ios")) {
      var $video = $("#local-video")[0];
      console.log($video);
      if (self.isMuted) {
        $video.muted = true;
      } else {
        $video.muted = false;
      }
    } else {
      if (!self.isMuted) {
        self.localVideo.stream.getAudioTracks()[0].enabled = true;
        self.localVideo.stream.getAudioTracks()[0].muted = true;
      } else {
        self.localVideo.stream.getAudioTracks()[0].enabled = false;
        self.localVideo.stream.getAudioTracks()[0].muted = false;
      }

      if (window.cordova) {
        window.cordova.plugins.iosrtc.refreshVideos();
      }
    }
  }

  minizeCall() {
    $body.addClass("call-minize");
    if (self.platform.is("ios")) {
      setTimeout(() => {
        window.cordova.plugins.iosrtc.refreshVideos();
      }, 100);
    }
  }

  switchCamera() {
    alert("Updating...");
  }

  backVideo() {
    $body.removeClass("call-minize");
    if (self.platform.is("ios")) {
      setTimeout(() => {
        window.cordova.plugins.iosrtc.refreshVideos();
      }, 100);
    }
  }

  muteSpeaker() {
    self.isVolume = !self.isVolume;
    console.log(self.isVolume);

    if (!self.platform.is("ios")) {
      var $video = $("#remote-video")[0];
      console.log($video);
      if (self.isVolume) {
        $video.muted = true;
      } else {
        $video.muted = false;
      }
    } else {
      if (!self.isVolume) {
        self.remoteVideo.stream.getAudioTracks()[0].enabled = true;
        self.remoteVideo.stream.getAudioTracks()[0].muted = true;
      } else {
        self.remoteVideo.stream.getAudioTracks()[0].enabled = false;
        self.remoteVideo.stream.getAudioTracks()[0].muted = false;
      }

      if (window.cordova) {
        window.cordova.plugins.iosrtc.refreshVideos();
      }
    }
  }
}
