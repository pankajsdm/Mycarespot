import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyMapPage } from './../pharmacy-map/pharmacy-map';
//import { DoctorsPage } from "../../../doctors/doctors";
import { PharmacyPage } from "../pharmacy";
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';


@Component({
  selector: 'page-pharmacy-add',
  templateUrl: 'pharmacy-add.html',
})
export class PharmacyAddPage {
  searchArr: any;
  searchList: any;
  search_data: any;
  responded_data: any;
  current_user: any;
  nodata_found = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: CommonServiceProvider
  ) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyAddPage');
    
    this.search_data = this.navParams.get('params');
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    console.log(this.search_data);
    this.searchPharmacy();
  }

  searchPharmacy(){
      this.authService.showLoader("Searching..."); 
      this.authService.post('patient/searchPharmacy', this.search_data).then((result) => {
        this.authService.hideLoader();
        this.searchArr = result;
        this.searchList = this.searchArr.data.Items;
        if(this.searchList.length==0){
          this.nodata_found = 'No se encontró una sola farmacia.';
        }
      }, (err) => {
        console.log("Something wrong...");
      });
  } 

  addData(storeName, city, state, zipCode, primaryPhone, address1, pharmacyId){
    this.authService.showLoader("Searching..."); 
    let add_ph = {
      patientId: this.current_user._id,
      name: storeName,
      city: city,
      state: state,
      zip: zipCode,
      phoneOrFax: primaryPhone,
      Address1: address1,
      PharmacyId: pharmacyId
    }
    this.authService.post('patient/addPatientPharmacy', add_ph).then((result) => {
      this.authService.hideLoader();
      this.responded_data = result;
      console.log("Result", result);      
    }, (err) => {
      console.log("Something wrong...");
    });
  } 

  search_pharmacy(){
    this.navCtrl.push(PharmacyPage);
  }

  map(){
    this.navCtrl.push(PharmacyMapPage);
  }


}
