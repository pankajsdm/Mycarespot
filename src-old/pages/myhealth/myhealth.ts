import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyRecordsPage } from './my-records/my-records';
import { MySuppliersPage } from './my-suppliers/my-suppliers';
import { MyPharmaciesPage } from './my-pharmacies/my-pharmacies';
import { MyDocumentsPage } from './my-documents/my-documents';

@Component({
  selector: 'page-myhealth',
  templateUrl: 'myhealth.html',
})
export class MyhealthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyhealthPage');
  } 

  switch(page){
    if(page=='MyRecordsPage'){
      this.navCtrl.push(MyRecordsPage);
    }else if(page=='MySuppliersPage'){
      this.navCtrl.push(MySuppliersPage);
    }else if(page=='MyPharmaciesPage'){
      this.navCtrl.push(MyPharmaciesPage);
    }else{
      this.navCtrl.push(MyDocumentsPage);
    }
  }

}
