import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacySearchPage } from './pharmacy-search/pharmacy-search';
//import { PharmacyAddPage } from './pharmacy-add/pharmacy-add';
import { SummaryPage } from './../summary/summary';

@Component({
  selector: 'page-pharmacy',
  templateUrl: 'pharmacy.html',
})
export class PharmacyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyPage');
  }

  search_pharmacy(){
    this.navCtrl.push(PharmacySearchPage);
  }

  summary(){
    this.navCtrl.push(SummaryPage);
  }

  
 cancle(){
  this.navCtrl.pop();
  }
}
