import { Component } from '@angular/core';
import {  ModalController, NavParams, NavController, MenuController } from 'ionic-angular';
import { PharmacySearchPage } from './../../patient-info/pharmacy/pharmacy-search/pharmacy-search';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';


@Component({
  selector: 'page-my-pharmacies',
  templateUrl: 'my-pharmacies.html',
})
export class MyPharmaciesPage {

  online: Boolean = true;
  loading: any;   
  rawMat: any;   
  lists: any;   
  currentUser: any;
  nodata_found = '';
  isLoading = true;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPharmaciesPage');
    this.currentUser = JSON.parse(localStorage.getItem('user_data'));
    this.getPharmacy(this.currentUser.patientId);
  }

  getPharmacy(_id) {
    if (this.online) {
      
      this.authService.get('users/getPatientPharmacy/' + _id).then(result => {
        this.isLoading = false;
        this.rawMat = result;
        this.lists = this.rawMat.data;
        if(this.lists.length==0){
          this.nodata_found = 'No tiene farmacias.';
        }
      },(err) =>{
        this.nodata_found = 'Something wrong...';
      });
    }
  }


  add_pharmacy(){
    this.navCtrl.push(PharmacySearchPage);
  }

}
