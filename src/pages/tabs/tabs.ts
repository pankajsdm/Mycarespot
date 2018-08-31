import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import { FeedPage } from '../feed/feed';
import { DoctorsPage } from '../doctors/doctors';
import { ConversationPage } from './../conversation/conversation';
import { MyhealthPage } from './../myhealth/myhealth';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tabs: any;

  constructor(public navParams: NavParams) {

  
  /* this.tab2Root = AboutPage;
  this.tab3Root = ContactPage;
  this.tab3Root = ContactPage;
  this.tab3Root = ContactPage;
  let getComponentFromNavPArams = navParams.get('page');
  if (getComponentFromNavPArams != undefined) {
    console.log("defined Root", getComponentFromNavPArams);
    this.tab1Root = getComponentFromNavPArams;
  } else {
    this.tab1Root = ContactPage;
  }  */

    
  this.tabs = [
      {root: FeedPage, icon: "home", enabled: false},
      {root: DoctorsPage, icon: "briefcase", enabled: false},
      {root: ConversationPage, icon: "chatboxes", enabled: false},
      {root: FeedPage, icon: "notifications", enabled: false},
      {root: MyhealthPage, icon: "heart", enabled: false},
      {root: FeedPage, icon: "calendar", enabled: false},
    ];  
   
    let getComponentFromNavPArams = navParams.get('page');
    if (getComponentFromNavPArams != undefined) {
      console.log("I am defined", getComponentFromNavPArams.name);
      this.tabs[1].root = getComponentFromNavPArams;
      this.tabs[1].enabled = true;

    } else {
      this.tabs[0].root = FeedPage;
      this.tabs[0].enabled = true;
    }

    console.log("defined Root", this.tabs);
    
  }


}
