import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyPage } from './../pharmacy/pharmacy';



@Component({
  selector: 'page-vitals',
  templateUrl: 'vitals.html',
})
export class VitalsPage {

  body = {systolic: '100', diastolic: '50', temprature: '100', breath: '12-28'};
  systolicArr = ['70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
  diastolicArr = ['40', '50', '60', '70', '80', '90', '100'];
  tempratureArr = ['95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106'];
  breathsArr = ['10-30', '12-28', '12-18', '17–23', '18–25', '20–30', '25–40', '30–60'];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsPage');
  }
  
  pharmacy(){
    this.navCtrl.push(PharmacyPage);
  }

}
