import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-country-code',
  templateUrl: 'country-code.html',
})
export class CountryCodePage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountryCodePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
    
  choose(code){
    let data = { 'code': code };
    this.viewCtrl.dismiss(data);
  }

}
