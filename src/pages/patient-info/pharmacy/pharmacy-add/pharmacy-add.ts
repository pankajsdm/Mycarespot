
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyMapPage } from './../pharmacy-map/pharmacy-map';
//import { DoctorsPage } from "../../../doctors/doctors";

@Component({
  selector: 'page-pharmacy-add',
  templateUrl: 'pharmacy-add.html',
})
export class PharmacyAddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyAddPage');
  }

  search_pharmacy(){
    this.navCtrl.push(PharmacyMapPage);
  }

  map(){
    this.navCtrl.push(PharmacyMapPage);
  }


}
