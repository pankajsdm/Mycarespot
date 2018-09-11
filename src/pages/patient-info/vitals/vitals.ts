import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyPage } from './../pharmacy/pharmacy';



@Component({
  selector: 'page-vitals',
  templateUrl: 'vitals.html',
})
export class VitalsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsPage');
  }
  
  pharmacy(){
    this.navCtrl.push(PharmacyPage);
  }

}
