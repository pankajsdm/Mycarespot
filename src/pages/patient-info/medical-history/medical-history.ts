import { Component } from '@angular/core';
import { ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { MedicalHistoryPhase2Page } from './medical-history-phase2/medical-history-phase2';
import { DoctorsPage } from "../../doctors/doctors";

@Component({
  selector: 'page-medical-history',
  templateUrl: 'medical-history.html',
})
export class MedicalHistoryPage {

  current_user: any;
  online: Boolean = true;
  lists: any;
  loading: any;
  user_data: any;

  arthritis: string = 'No';
  asthma_or_copd: string = 'No';
  cancer: string = 'No';
  high_cholesterol: string = 'No';
  depression: string = 'No';
  stroke: string = 'No';
  diabetes: string = 'No';
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
    console.log('ionViewDidLoad MedicalHistoryPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');  
  }

  
  medicalHistoryPhase2(){

    if(this.online){
      this.authService.showLoader();
      let data = {
          patient_user_id: this.current_user._id,
          have_you_been_diagnosed_with_any_of_the_following_conditions: {
            arthritis: this.arthritis,
            asthma_or_copd: this.asthma_or_copd,
            cancer: this.cancer,
            high_cholesterol: this.high_cholesterol,
            depression: this.depression,
            stroke: this.stroke,
            diabetes: this.diabetes
          }
      } 
      this.authService.post('patient/addHealthQuestions', data).then((result) => {
        this.authService.hideLoader();
          this.lists =  result; 
          if(this.lists.code==200){
            this.navCtrl.push(MedicalHistoryPhase2Page);
          }else{
              this.presentToast(this.lists.message);
          }
      },(err) => {
        this.authService.hideLoader();
        this.presentToast('Something wrong! Please try later.');
      });

    }else{
      this.presentToast('Oh no! No internet found.');
    }

  }


  funArtritis(value){
    this.arthritis = value;
  }
  funAsthmaCopd(value){
    this.asthma_or_copd = value;
  }
  funCancer(value){
    this.cancer = value;
  }
  funCholesterol(value){
    this.high_cholesterol = value;
  }
  funDepression(value){
    this.depression = value;
  }
  funStroke(value){
    this.stroke = value;
  }
  funDiabetes(value){
    this.diabetes = value;
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
