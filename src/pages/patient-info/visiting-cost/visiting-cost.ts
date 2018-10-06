import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-visiting-cost',
  templateUrl: 'visiting-cost.html',
})
export class VisitingCostPage {

  user_picture: String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCostPage');
    this.user_picture = localStorage.getItem('user_picture');    
  }

  cancle(){
    this.navCtrl.pop();
  }

}
