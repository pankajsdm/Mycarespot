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

  sheets(){
  }

  diagnostics(){
    this.navCtrl.push(DiagnosticsPage, {type: 'diagnostics'});
  }
  social_history(){
    this.navCtrl.push(DiagnosticsPage, {type: 'social_history'});
  }
  past_medical_history(){
    this.navCtrl.push(DiagnosticsPage, {type: 'past_medical_history'});
  }
  advanced_directives(){   
  } 
  allergies(){
    this.navCtrl.push(DiagnosticsPage, {type: 'allergies'});
  }
  medications(){
    
  }
  implantable_devices(){
    
  }
  encounters(){
    
  }
  messages(){
    
  }
  appointments(){
    
  }
  

}
