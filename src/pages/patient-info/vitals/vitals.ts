import { Component } from '@angular/core';
import { ToastController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';

import { PharmacyPage } from './../pharmacy/pharmacy';



@Component({
  selector: 'page-vitals',
  templateUrl: 'vitals.html',
})
export class VitalsPage {

  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;   
  lists: any;   
  current_user: any;
  body = {systolic: '100', diastolic: '50', temprature: '100', breath: '12-28'};
  systolicArr = ['70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
  diastolicArr = ['40', '50', '60', '70', '80', '90', '100'];
  tempratureArr = [95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
  breathsArr = ['10-30', '12-28', '12-18', '17–23', '18–25', '20–30', '25–40', '30–60'];

  constructor( 
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
  }

  systolicSelect(val){
    this.body.systolic = val;
  }
  diastolicSelect(val){
    this.body.diastolic = val; 
  }
  tempratureSelect(val){
    this.body.temprature = val;
  }
  breathSelect(val){
    this.body.breath = val;
  }
  
  otherBodyVitals(){

    if(this.online){
      this.showLoader();
      let data = {
          patient_user_id: this.current_user._id,
          systolic: this.body.systolic,
          diastolic: this.body.diastolic,
          temperature: parseInt(this.body.temprature),
          breaths_per_minute: this.body.breath
      }
      this.authService.post('patient/addPatientVitals', data).then((result) => {
          this.loading.dismiss();
          this.lists =  result; 
          if(this.lists.code==200){
              this.navCtrl.push(PharmacyPage);
          }else{
              this.presentToast(this.lists.message);
          }
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    } 
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
