
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InsuranceDetailPage } from './../insurance-list/insurance-detail/insurance-detail';
import { DoctorsPage } from "../../doctors/doctors";
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { VisitingCostPage } from './../visiting-cost/visiting-cost';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  user_picture: String;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: CommonServiceProvider
  ) {
  } 
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    this.user_picture = localStorage.getItem('user_picture');    
  }

  details(){
    this.navCtrl.push(VisitingCostPage);
  }

  editDetail(){
    this.navCtrl.push(InsuranceDetailPage);
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
