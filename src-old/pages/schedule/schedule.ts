import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DoctorsPage } from '../doctors/doctors';
import { AppointmentsRequestPage } from './appointments-request/appointments-request';
import { ListAppointmentsPage } from './list-appointments/list-appointments';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  appointmentRequest(){
    this.navCtrl.push(AppointmentsRequestPage);
  }
  
  upcomingAppointments(){
    this.navCtrl.push(ListAppointmentsPage);
  }

  pastAppointments(){
    this.navCtrl.push(ListAppointmentsPage);
  }

}


