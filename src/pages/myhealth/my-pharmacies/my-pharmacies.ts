import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyAddPage } from './../../patient-info/pharmacy-add/pharmacy-add';


@Component({
  selector: 'page-my-pharmacies',
  templateUrl: 'my-pharmacies.html',
})
export class MyPharmaciesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPharmaciesPage');
  }

  add_pharmacy(){
    this.navCtrl.push(PharmacyAddPage);
  }

}
