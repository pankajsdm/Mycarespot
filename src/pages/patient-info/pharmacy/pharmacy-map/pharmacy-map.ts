import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';


@Component({
  selector: 'page-pharmacy-map',
  templateUrl: 'pharmacy-map.html',
})  

export class PharmacyMapPage {
 
  constructor( 
    public zone: NgZone,
    public navParams: NavParams,

  ) {

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyMapPage');
    
  }

  


}
