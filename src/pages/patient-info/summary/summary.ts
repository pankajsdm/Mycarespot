
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InsuranceDetailPage } from './../insurance-list/insurance-detail/insurance-detail';
import { DoctorsPage } from "../../doctors/doctors";

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  user_picture: String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  } 
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    this.user_picture = localStorage.getItem('user_picture');    
  }

  details(){
    this.navCtrl.push(InsuranceDetailPage);
  }

  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
  }

}
