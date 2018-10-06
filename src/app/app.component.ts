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
import { DoctorProfilePage } from './../pages/doctor-profile/doctor-profile';
import { ProfilePage } from './../pages/profile/profile';
import { AdjustmentsPage } from './../pages/adjustments/adjustments';
import { Config } from "./app.config";
declare let Media: any;

import * as io from "socket.io-client";
let socket;
let self;

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;
  //rootPage:any = PatientSimptomPage;
  pages: any;
  user = { firstName: "", lastName: "" };
  channels = [];

  public feedPage = "Feed";
  public aboutPage = "About";
  public contactPage = "Contact";
  public ProfilePage = "Mi Perfil";
  public AdjustmentsPage = "Ajustes";

  constructor(
    public events: Events,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private http: HttpClient
  ) {
    self = this;
    events.subscribe("user:update", user => {
      console.log("my date", user.firstName, user.lastName);
      this.user.firstName = user.firstName;
      this.user.lastName = user.lastName;
    });

    platform.ready().then(() => {
      this.main_navigation();
      statusBar.styleDefault();
      splashScreen.hide();
      this.socketCreation();  
    });
  }
  
  socketCreation(){
    let currentUser = JSON.parse(localStorage.getItem("user_data"));
    if(currentUser){
    let my_media;
    document.addEventListener("deviceready", function() {
      my_media = new Media(
        "./confident.mp3",
        // success callback
        function() {
          console.log("playAudio():Audio Success");
        },
        // error callback
        function(err) {
          console.log("playAudio():Audio Error: " + err);
        }
      );
    });

    socket = io.connect("https://futucare.com");

    socket.on("message:save", doc => {
      if (currentUser && currentUser._id != doc.from.userId) {
        self.events.publish("message", doc);
        my_media.play();
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

    if (!currentUser) {
      return;
    }

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

        console.log("data", self.channels);
      });
    }
  }

  main_navigation() {
    this.pages = [
      { icon: 'ios-contact', title: this.ProfilePage, component: ProfilePage },
      { icon: 'ios-settings', title: this.AdjustmentsPage, component: AdjustmentsPage },
    ];
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  getProfile() {
    let currentUser = JSON.parse(localStorage.getItem("user_data"));
    this.nav.setRoot(ProfilePage, { _id:  currentUser._id});
  }

  logout() {
    localStorage.clear();
    this.nav.setRoot(LoginPage);
  }
}
