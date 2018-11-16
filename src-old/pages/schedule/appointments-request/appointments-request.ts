import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { AppointmentsPage } from './../appointments/appointments';

@Component({
  selector: 'page-appointments-request',
  templateUrl: 'appointments-request.html',
})
export class AppointmentsRequestPage {

  online: Boolean = true;
  loading: any;
  doctrArr: any;
  doctors: any;

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
  ) {
  }
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentRequestPage');
    this.getDoctors();
  }
     
  getDoctors(){
    if(this.online){
        this.showLoader();
        this.authService.get('users/getPRactionerList').then((result) => {
          this.loading.dismiss();
          this.doctrArr = result;  
          this.doctors = this.doctrArr.data; 
          console.log("doctors", this.doctors);
        },(err) => {
          this.loading.dismiss();
          this.presentToast('Something wrong! Please try later.');
        });
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }   

  appointment(_id){
    this.navCtrl.push(AppointmentsPage, {
      _id: _id
    });
  }

  /* Show prgoress loader*/
  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }   
      
  /* Creating toast */
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
