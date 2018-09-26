
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VisitingCostPage } from './../../visiting-cost/visiting-cost';

@Component({
  selector: 'page-insurance-detail',
  templateUrl: 'insurance-detail.html',
})
export class InsuranceDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsuranceDetailPage');
  }

  confirm(){
    this.navCtrl.push(VisitingCostPage);
  }

}
