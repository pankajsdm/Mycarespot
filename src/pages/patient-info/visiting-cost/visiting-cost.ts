import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DoctorsPage } from "../../doctors/doctors";
import { CommonServiceProvider } from '../../../providers/common-service/common-service';


@Component({
  selector: 'page-visiting-cost',
  templateUrl: 'visiting-cost.html',
})
export class VisitingCostPage {

  user_picture: String;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: CommonServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCostPage');
    this.user_picture = localStorage.getItem('user_picture');    
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
