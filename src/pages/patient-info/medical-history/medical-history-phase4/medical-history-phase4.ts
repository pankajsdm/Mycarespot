import { Component } from '@angular/core';
import { RiskFactorsPage } from '../../risk-factors/risk-factors';
import { ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';
import { MedicalHistoryPhase5Page } from './../medical-history-phase5/medical-history-phase5';
import { DoctorsPage } from "../../../doctors/doctors";


@Component({
  selector: 'page-medical-history-phase4',
  templateUrl: 'medical-history-phase4.html',
})
export class MedicalHistoryPhase4Page {

  lists: any;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  current_user: any;
  user_picture: String;
  isLoading: Boolean = false;
  
  constructor(
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalHistoryPhase4Page');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');    
  }

  medicalHistoryPhase5(val){
    if(this.online){
      if(val=='No'){
        this.navCtrl.pop();
      }else{
      this.authService.showLoader();
      let data = {
          patient_user_id: this.current_user._id,
          are_you_allergic_to_any_medications: val
      }
      this.authService.post('patient/addHealthQuestions', data).then((result) => {
        this.authService.hideLoader(); 
          this.lists =  result; 
          if(this.lists.code==200){
              this.navCtrl.push(MedicalHistoryPhase5Page);
          }else{
              this.presentToast(this.lists.message);
          }       
      },(err) => {
        this.authService.hideLoader();
        this.presentToast('Something wrong! Please try later.');
      });
    }
    }else{
      this.presentToast('Oh no! No internet found.');
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
