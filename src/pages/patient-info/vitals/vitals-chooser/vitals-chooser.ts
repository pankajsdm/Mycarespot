import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-vitals-chooser',
  templateUrl: 'vitals-chooser.html',
})
export class VitalsChooserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsChooserPage');
  }

}
