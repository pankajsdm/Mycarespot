import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyAddPage } from './../pharmacy-add/pharmacy-add';
import { PharmacyMapPage } from './../pharmacy-map/pharmacy-map';
import { DoctorsPage } from "../../../doctors/doctors";
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';

@Component({
  selector: 'page-pharmacy-search',
  templateUrl: 'pharmacy-search.html',
})
export class PharmacySearchPage {

  public searchForm: FormGroup;
  isSearched: Boolean = true;
  search: any = {zip: '', pharmacyName:'', phoneOrFax: ''};
  searchArr: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formdata: FormBuilder,
    public authService: CommonServiceProvider,
  ) {

    this.searchForm = this.formdata.group({
      zip: [''],
      pharmacyName: [''],
      phoneOrFax: [''],
    });

  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacySearchPage');
  }

  searchNearMe(){
    //this.navCtrl.push(PharmacyMapPage);
    if(this.searchForm.get('zip').value=='' && this.searchForm.get('pharmacyName').value=='' && this.searchForm.get('phoneOrFax').value==''){
      this.authService.presentAlert('Error', 'Please fill at least one field.', 'Ok');
    }else{
      console.log(this.searchForm.get('pharmacyName').value);

      if(this.searchForm.get('zip').value=="" || isNaN(this.searchForm.get('zip').value)){
        delete this.search.zip;
      } else{
        this.search.zip = parseInt(this.searchForm.get('zip').value);
      }
      if(this.searchForm.get('phoneOrFax').value=="" || isNaN(this.searchForm.get('phoneOrFax').value)){
        delete this.search.phoneOrFax;
      } else{
        this.search.phoneOrFax = parseInt(this.searchForm.get('phoneOrFax').value);
      }
      setTimeout(() => {
        this.navCtrl.push(PharmacyMapPage, {params: this.search});
      }, 1000);
      
    }
  } 

  searchPharmacy(){
    if(this.search.zip=='' && this.search.pharmacyName=='' && this.search.phoneOrFax==''){
      this.authService.presentAlert('Error', 'Please fill at least one field.', 'Ok');
    }else{
      
      if(this.search.zip=="" || isNaN(this.search.zip)){
          delete this.search.zip;
      }else{
        this.search.zip = parseInt(this.search.zip);
      }

      if(this.search.phoneOrFax=="" || isNaN(this.search.phoneOrFax)){
        delete this.search.phoneOrFax;
      }else{
        this.search.phoneOrFax = parseInt(this.search.phoneOrFax);
      }

      setTimeout(() => {
        this.navCtrl.push(PharmacyAddPage, {params: this.search});
      }, 1000);
      
    }
 
  }

  ionViewDidEnter(){
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = 'none';
    }
  }
  

  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
  }

}
