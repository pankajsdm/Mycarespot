import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';


@Component({
  selector: 'page-pharmacy-map',
  templateUrl: 'pharmacy-map.html',
})  

export class PharmacyMapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;

  constructor( 

  ) {

  

  }

 
  


}
