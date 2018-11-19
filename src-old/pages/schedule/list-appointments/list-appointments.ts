import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppointmentsPage } from './../appointments/appointments';

@Component({
  selector: 'page-list-appointments',
  templateUrl: 'list-appointments.html',
})
export class ListAppointmentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PastAppointmentsPage');
  }

  appointmentPage(){  
    console.log("appointment page")
    this.navCtrl.push(AppointmentsPage);
  }

}
