
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VisitingCostPage } from './../../visiting-cost/visiting-cost';
import { DoctorsPage } from "../../../doctors/doctors";
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';


@Component({
  selector: 'page-insurance-detail',
  templateUrl: 'insurance-detail.html',
})
export class InsuranceDetailPage {

  user_picture: String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: CommonServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsuranceDetailPage');
    this.user_picture = localStorage.getItem('user_picture');
    
  }

  confirm(){
    this.navCtrl.push(VisitingCostPage);
  }

  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
  }

}
