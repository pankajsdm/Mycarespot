


import { Component } from '@angular/core';
import { ToastController, ModalController, LoadingController, NavParams, NavController, MenuController, AlertController } from 'ionic-angular';
import { PharmacySearchPage } from './pharmacy-search/pharmacy-search';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
//import { PharmacyAddPage } from './pharmacy-add/pharmacy-add';
import { SummaryPage } from './../summary/summary';
import { DoctorsPage } from "../../doctors/doctors";

@Component({
  selector: 'page-pharmacy',
  templateUrl: 'pharmacy.html',
})
export class PharmacyPage {

  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;   
  rawMat: any;   
  lists: any[] = [];   
  current_user: any;
  user_picture: String;
  nodata_found = '';

  constructor( 
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams,
    public alertCtrl: AlertController
    ) {
    
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyPage');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.user_picture = localStorage.getItem('user_picture');    
    this.getPatientPharmacy();
  }

  getPatientPharmacy(){
    
    if(this.online){
      this.showLoader();
      this.authService.get('users/getPatientPharmacy/'+this.current_user.patientId).then((result) => {
          this.loading.dismiss();
          this.rawMat =  result; 
          this.lists = this.rawMat.data;
          if(this.lists.length==0){
            this.nodata_found = 'No tiene farmacias.';
          }
      },(err) => { 
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    } 
  }   

  summary(id){
    this.navCtrl.push(SummaryPage);
  }

  search_pharmacy(){
    this.navCtrl.push(PharmacySearchPage);
  } 

  saltar(id){
    //this.navCtrl.push(PharmacySearchPage);
  }

  
  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
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

  ionViewDidEnter() {
    if(localStorage.getItem('pharmacy_add')){
      this.getPatientPharmacy();
      localStorage.removeItem('pharmacy_add');
    }
  }

  removePharmacy(patientId, PharmacyId, index) {
    console.log(patientId, PharmacyId, index)
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Estas seguro que quieres borrarlo?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log("clicked no")
            // this.action = false;
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log("clicked yes")
            let data: any = {
              patientId: patientId,
              PharmacyId: PharmacyId,
              index: index
            }
            this.deletePharmacy(data);
            // this.action = true;
          }
        }
      ]
    });
    alert.present()
  }

  deletePharmacy(data) {
    console.log("data========= ", data)
    // this.authService.showLoader();
    this.authService.post('patient/deletePatientPharmacy', data).then((result : any) => {
      // this.authService.hideLoader();       
      if (result.code == 200) {
        this.lists.splice(data.index, 1);
        this.authService.presentToast(result.message, 'middle');        
      } else {
        this.authService.presentToast(result.message, 'bottom');
      }
    }, (err) => {
      // this.authService.hideLoader();
      this.authService.presentToast("Something went wrong...", 'bottom');
    });
  }



}
