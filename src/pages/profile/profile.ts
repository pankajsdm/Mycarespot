import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { TabsPage } from './../tabs/tabs';
import { ProfileDetailsPage } from './profile-details/profile-details';

  
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  details(){
    this.navCtrl.push(ProfileDetailsPage);
  }

  openMenu(){
    this.menu.open();
  }

  home(){
    this.navCtrl.setRoot(TabsPage);
  }

}
