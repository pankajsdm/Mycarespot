import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

}
