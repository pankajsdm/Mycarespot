import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyAddPage } from './../pharmacy-add/pharmacy-add';
import { PharmacyMapPage } from './../pharmacy-map/pharmacy-map';
import { DoctorsPage } from "../../../doctors/doctors";


@Component({
  selector: 'page-pharmacy-search',
  templateUrl: 'pharmacy-search.html',
})
export class PharmacySearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacySearchPage');
  }

  searchNearMe(){
    this.navCtrl.push(PharmacyMapPage);
  }
  searchPharmacy(){
    this.navCtrl.push(PharmacyAddPage);
  }
  

  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
  }

}
