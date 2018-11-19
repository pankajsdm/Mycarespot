
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatientSimptomPage } from './../patient-simptom/patient-simptom';
import { DoctorsPage } from "../../doctors/doctors";
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { PatientSimptomNextPage } from './../patient-simptom/patient-simptom-next/patient-simptom-next';
import { RiskFactorsPage } from './../risk-factors/risk-factors';

@Component({
  selector: 'page-options-simptom',
  templateUrl: 'options-simptom.html',
})
export class OptionsSimptomPage {

  user_picture: String;
  
  constructor(public authService: CommonServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsSimptomPage');
    this.user_picture = localStorage.getItem('user_picture');   
  }

  optionSimptom(val){
    if(val=='yes'){
      this.navCtrl.push(PatientSimptomPage);
    }else{
      this.navCtrl.push(RiskFactorsPage);
    }
  }
  
  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
  }

}
