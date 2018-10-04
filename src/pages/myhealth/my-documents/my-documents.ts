import { Component } from '@angular/core';
import {  ModalController, NavParams, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';

@Component({
  selector: 'page-my-documents',
  templateUrl: 'my-documents.html',
})
export class MyDocumentsPage {

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
    console.log('ionViewDidLoad MyDocumentsPage');
    this.currentUser = JSON.parse(localStorage.getItem('user_data'));
    this.getDocument(this.currentUser.patientId);
  }
  
  getDocument(_id) {
    if (this.online) {
      
      this.authService.get('patient/getUploadDocument/' + _id).then(result => {
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



  docProfile(){
    
  }

}
