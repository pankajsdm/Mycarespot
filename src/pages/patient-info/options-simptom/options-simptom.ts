import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatientSimptomPage } from './../patient-simptom/patient-simptom';
import { DoctorsPage } from "../../doctors/doctors";

@Component({
  selector: 'page-options-simptom',
  templateUrl: 'options-simptom.html',
})
export class OptionsSimptomPage {

  user_picture: String;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsSimptomPage');
    this.user_picture = localStorage.getItem('user_picture');   
  }

  optionSimptom(val){
    this.navCtrl.push(PatientSimptomPage);
  }
  
  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
  }

}
