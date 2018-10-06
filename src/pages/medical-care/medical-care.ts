import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { DoctorsPage } from '../doctors/doctors';
  
@Component({
  selector: 'page-medical-care',
  templateUrl: 'medical-care.html',
})
export class MedicalCarePage {

  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalCarePage');
  }

  suppliers(){
    this.navCtrl.push(DoctorsPage);
  }

  openMenu(){
    this.menu.open();
  } 

}
