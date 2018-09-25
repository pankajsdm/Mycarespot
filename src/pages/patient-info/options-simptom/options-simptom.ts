import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatientSimptomPage } from './../patient-simptom/patient-simptom';

@Component({
  selector: 'page-options-simptom',
  templateUrl: 'options-simptom.html',
})
export class OptionsSimptomPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsSimptomPage');
  }

  optionSimptom(val){
    this.navCtrl.push(PatientSimptomPage);
  }
  
  cancle(){
    this.navCtrl.pop();
  }

}
