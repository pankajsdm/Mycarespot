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

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;
  //rootPage:any = BodyMeasurementsPage;
  pages: any;
  user = { firstName: "", lastName: "" };

  public feedPage = "Feed";
  public aboutPage = "About";
  public contactPage = "Contact";

  constructor(
    public events: Events,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    events.subscribe("user:update", user => {
      console.log("my date", user.firstName, user.lastName);
      this.user.firstName = user.firstName;
      this.user.lastName = user.lastName;
    });

    platform.ready().then(() => {
      this.main_navigation();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  main_navigation() {
    this.pages = [{ title: this.feedPage, component: FeedPage }];
  }

  openPage(page) {
    //this.nav.setRoot(page.component);
    this.nav.setRoot(TabsPage, { page: page.component });
  }

  getProfile() {}

  logout() {
    localStorage.clear();
    this.nav.setRoot(LoginPage);
  }
}
