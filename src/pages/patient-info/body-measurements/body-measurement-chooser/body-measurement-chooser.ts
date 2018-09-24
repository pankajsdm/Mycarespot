import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-body-measurement-chooser',
  templateUrl: 'body-measurement-chooser.html',
})
export class BodyMeasurementChooserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BodyMeasurementChooserPage');
  }

}
