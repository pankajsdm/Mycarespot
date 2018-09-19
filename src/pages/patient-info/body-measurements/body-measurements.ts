import { Component } from '@angular/core';
import { ToastController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { VitalsPage } from './../vitals/vitals';



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
  selectHeight: any;
  selectWeight: any;
  heights = [ '5.2', '5.4', '5.6', '5.8', '6.0', '6.1', '6.2', '6.3', '6.4', '6.5'];
  weights = [ '55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'];

  constructor(
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) { 
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalHistoryPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
  } 

  heightSelect(val){
    console.log(val);
    this.selectHeight = val;
  }
  weightSelect(val){
    console.log(val);
    this.selectWeight = val;
  }

    
  vitals(){
    if(this.online){
      this.showLoader();
      let data = {
          patient_user_id: this.current_user._id,
          height: this.selectHeight,
          weight: this.selectWeight,
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
