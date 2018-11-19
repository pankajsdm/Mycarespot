import { Component } from '@angular/core';
import { ToastController, ModalController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { VitalsPage } from './../vitals/vitals';
import { BodyMeasurementChooserPage } from './body-measurement-chooser/body-measurement-chooser';


@Component({
  selector: 'page-body-measurements',
  templateUrl: 'body-measurements.html',
})
export class BodyMeasurementsPage {

  body: any = {height: '5.6', weight: '65'};
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;   
  lists: any;   
  current_user: any;


  constructor(
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) { 
    
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad BodyMeasurementsPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
  } 


  choose(val){
    let profileModal = this.modalCtrl.create(BodyMeasurementChooserPage, { value: val });
    profileModal.onDidDismiss(data => {
      console.log(data.code);
      if(val=='height'){
        this.body.height = data.code;
      }else{
        this.body.weight = data.code;
      }
    });
    profileModal.present();
  }

    
  vitals(){
    if(this.online){
      this.showLoader();
      let data = {
          patient_user_id: this.current_user._id,
          height: this.body.height,
          weight: this.body.weight,
      }
      this.authService.post('patient/addPatientVitals', data).then((result) => {
          this.loading.dismiss();
          this.lists =  result; 
          if(this.lists.code==200){
              this.navCtrl.push(VitalsPage);
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

  cancle(){
    this.navCtrl.pop();
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
