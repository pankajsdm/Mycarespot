import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-my-documents',
  templateUrl: 'my-documents.html',
})
export class MyDocumentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDocumentsPage');
  }

  docProfile(){
    
  }

}
