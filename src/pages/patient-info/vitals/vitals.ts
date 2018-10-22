
import { Component } from '@angular/core';
import { ToastController, ModalController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { VitalsChooserPage } from './vitals-chooser/vitals-chooser';
import { PharmacyPage } from './../pharmacy/pharmacy';
import { DoctorsPage } from "../../doctors/doctors";


@Component({
  selector: 'page-vitals',
  templateUrl: 'vitals.html',
})
export class VitalsPage {

  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;   
  user_picture: String;
  lists: any;   
  current_user: any;
  body = {
    height: '5.6', 
    weight: '65', 
    systolic: '100', 
    diastolic: '50', 
    temprature: '100', 
    breath: '12-28',
    pulse: '72-75'
  };
  isLoading: Boolean = false;

  
  
  constructor( 
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams) {
    
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');
    
  }

 
  choose(val){
    let profileModal = this.modalCtrl.create(VitalsChooserPage, { value: val });
    profileModal.onDidDismiss(data => {
      console.log(data.code);
      if(val=='weight'){
        this.body.weight = ''+data.code;
      }else if(val=='height'){
        this.body.height = data.code;
      }else if(val=='systolic'){
        this.body.systolic = data.code;
      }else if(val=='diastolic'){
        this.body.diastolic = data.code;
      }else if(val=='temprature'){
        this.body.temprature = data.code;
      }else if(val=='pulse'){
        this.body.pulse = data.code;
      }else{
        this.body.breath = data.code;
      }
    });
    profileModal.present();
  }
  
  otherBodyVitals(){

    if(this.online){
      this.isLoading = true;
      let data = {
          patient_user_id: this.current_user._id,
          height: this.body.height,
          weight: this.body.weight,
          systolic: this.body.systolic,
          diastolic: this.body.diastolic,
          temperature: parseInt(this.body.temprature),
          breaths_per_minute: this.body.breath
      }
      this.authService.post('patient/addPatientVitals', data).then((result) => {
        this.isLoading = false;
          this.lists =  result; 
          if(this.lists.code==200){
              this.navCtrl.push(PharmacyPage);
          }else{
              this.presentToast(this.lists.message);
          }
      },(err) => {
        this.isLoading = false;
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    } 
  }

  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
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
