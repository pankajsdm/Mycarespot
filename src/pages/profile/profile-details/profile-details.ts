import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {
  user_data = {firstName: '', lastName: '', avatar : ''};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileDetailsPage view');
    this.user_data = JSON.parse(localStorage.getItem('user_data'));
  }

}
