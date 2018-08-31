import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiagnosticsPage } from './diagnostics/diagnostics';

@Component({
  selector: 'page-my-records',
  templateUrl: 'my-records.html',
})
export class MyRecordsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRecordsPage');
  }

  switch(){
    this.navCtrl.push(DiagnosticsPage);
  }

}
