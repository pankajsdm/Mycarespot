import { Component } from '@angular/core';
import { RiskFactorsPage } from '../../risk-factors/risk-factors';
import { ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';
import { DoctorsPage } from "../../../doctors/doctors";


@Component({
  selector: 'page-patient-simptom-next',
  templateUrl: 'patient-simptom-next.html',
})
export class PatientSimptomNextPage {

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
    console.log('ionViewDidLoad PatientSimptomNextPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');   
  }

  riskFactors(param){
    if(this.online){
        this.isLoading = true;
        let data = {
            patient_user_id: this.current_user._id,
            when_did_you_start_to_feel_that_way: param
        }
        
        this.authService.post('patient/addHealthQuestions', data).then((result) => {
          this.isLoading = false;
            this.lists =  result; 
            if(this.lists.code==200){
                this.navCtrl.push(RiskFactorsPage);
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
