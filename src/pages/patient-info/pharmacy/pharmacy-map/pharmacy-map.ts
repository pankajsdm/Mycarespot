import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';
import { Geolocation, Geoposition} from '@ionic-native/geolocation';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';

@Component({
  selector: 'page-pharmacy-map',
  templateUrl: 'pharmacy-map.html',
})  

export class PharmacyMapPage {



  
  ionViewDidLoad() {
    console.log('ionViewDidLoad Map Phage');
  }


}
