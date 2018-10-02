import { Component } from '@angular/core';
import { ToastController, ModalController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { PharmacySearchPage } from './pharmacy-search/pharmacy-search';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
//import { PharmacyAddPage } from './pharmacy-add/pharmacy-add';
import { SummaryPage } from './../summary/summary';

@Component({
  selector: 'page-pharmacy',
  templateUrl: 'pharmacy.html',
})
export class PharmacyPage {

  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;   
  rawMat: any;   
  lists: any;   
  current_user: any;
  user_picture: String;
  nodata_found = 'No ha añadido farmacia.';

  constructor( 
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams) {
    
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
      this.authService.get('users/getPatientPharmacy/'+this.current_user._id).then((result) => {
          this.loading.dismiss();
          this.rawMat =  result; 
          this.lists = this.rawMat.data;
      },(err) => { 
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    } 
  } 

  search_pharmacy(){
    this.navCtrl.push(PharmacySearchPage);
  }

  summary(id){
    this.navCtrl.push(SummaryPage);
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
