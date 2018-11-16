import { Component } from '@angular/core';
import { ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { MedicalHistoryPage } from './../medical-history/medical-history';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { DoctorsPage } from "../../doctors/doctors";


@Component({
  selector: 'page-risk-factors',
  templateUrl: 'risk-factors.html',
})
export class RiskFactorsPage {

  current_user: any;
  online: Boolean = true;
  lists: any;
  loading: any;
  user_data: any;

  i_exercise: string = 'Si';
  i_smoke: string = 'No';
  i_had_unsafe_sex: string = 'No se';
  i_am_overweight: string = 'No';
  use_alchole: string = 'No';
  i_use_drugs: string = 'No';
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
    console.log('ionViewDidLoad RiskFactorsPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');  
  }

  funExercise(value){
    console.log("i ma checked", value);
    this.i_exercise = value;
  }
  funSmoke(value){
    console.log("i ma checked", value);
    this.i_smoke = value;
  }
  funUnsafeSex(value){
    console.log("i ma checked", value);
    this.i_had_unsafe_sex = value;
  }
  funOverweight(value){
    console.log("i ma checked", value);
    this.i_am_overweight = value;
  }
  funUseAlco(value){
    console.log("i ma checked", value);
    this.use_alchole = value;
  }
  funUseDrug(value){
    console.log("i ma checked", value);
    this.i_use_drugs = value;
  }

  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
  }
    

  selectAffirmations(){

    if(this.online){
     this.isLoading = true;
      let data = {
          patient_user_id: this.current_user._id,
          select_the_affirmations_that_apply_to_you: {
            i_exercise: this.i_exercise,
            i_smoke: this.i_smoke,
            i_had_unsafe_sex: this.i_had_unsafe_sex,
            i_am_overweight: this.i_am_overweight,
            use_alchole: this.use_alchole,
            i_use_drugs: this.i_use_drugs
          }
      } 
      this.authService.post('patient/addHealthQuestions', data).then((result) => {
        this.isLoading = false;
          this.lists =  result; 
          if(this.lists.code==200){
            this.navCtrl.push(MedicalHistoryPage);
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
