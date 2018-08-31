import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DoctorProfilePage } from './../doctor-profile/doctor-profile';

@Component({
  selector: 'page-doctors',
  templateUrl: 'doctors.html',
})
export class DoctorsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorsPage');
  }

  userProfile(){
    this.navCtrl.push(DoctorProfilePage);
  }

}
