import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';

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
  search_data: any;
  museumList: any = [];
  searchArr: any;
  searchList: any;
  infoWindows: any;
  current_user: any;
  responded_data: any;

  constructor(
    public zone: NgZone,
    public navParams: NavParams,

  ) {

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyMapPage');
    
  //}

  
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    var defaultLatLng = { lat: 25.82, lng: -124.39 };
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLatLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    /* Set other map attributes*/
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(25.82, -124.39),
      new google.maps.LatLng(49.38, -66.94),
    )
    this.map.fitBounds(bounds);
    let zoomChangeBoundsListener =
      google.maps.event.addListenerOnce(this.map, 'bounds_changed', function (event) {
        if (this.getZoom()) {
          this.setZoom(3);
        }
      });
    setTimeout(function () { google.maps.event.removeListener(zoomChangeBoundsListener) }, 2000);
    /*** End to define the attributes ***/

    this.searchPharmacy();
  }

  searchPharmacy() {
    /*this.authService.showLoader("Searching...");
    this.authService.post('patient/searchPharmacy', this.search_data).then((result) => {
      this.authService.hideLoader();
      this.searchArr = result;
      this.searchList = this.searchArr.data.Items;
      this.addMarkersToMap(this.searchList);*/
      /* for (let index = 0; index < this.searchList.length; index++) {
          this.addMarkersToMap(this.searchList[index]);
      } */
    /*}, (err) => {
      this.authService.hideLoader();
      console.log("Something wrong...");
    });*/
  }

  addInfoWindowToMarker(marker, ph_id, city, state, address, zip, phone) {

    var infoWindowContent = '<div class="info_content">' +
      //'<strong>'+marker.title+'</strong>' +
      '<p><strong>' + marker.title + '</strong></p>' +
      '<p>' + address + '</p>' +
      '<p>' + city + ', ' + state + ', ' + zip + '</p>' +
      '<input type="hidden" id="storename" value="' + marker.title + '">' +
      '<input type="hidden" id="city" value="' + city + '">' +
      '<input type="hidden" id="state" value="' + state + '">' +
      '<input type="hidden" id="zipCode" value="' + zip + '">' +
      '<input type="hidden" id="primaryPhone" value="' + phone + '">' +
      '<input type="hidden" id="address1" value="' + address + '">' +
      '<p><button id="clickableItem" class="' + ph_id + '" type="button">Añadir</button></p>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);

    /* Get the information from info window */
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('clickableItem').addEventListener('click', () => {
        var pharmacyId = document.getElementById("clickableItem").className;
        var storeName = document.getElementById("storename")['value'];
        var city = document.getElementById("city")['value'];
        var state = document.getElementById("state")['value'];
        var zipCode = document.getElementById("storename")['value'];
        var primaryPhone = document.getElementById("primaryPhone")['value'];
        var address1 = document.getElementById("address1")['value'];
        this.addData(storeName, city, state, zipCode, primaryPhone, address1, pharmacyId);
      });
    });
  }

  addData(storeName, city, state, zipCode, primaryPhone, address1, pharmacyId) {
    //this.authService.showLoader("Actualizando...");

    let phoneFax = ''
    if (primaryPhone !== null && primaryPhone !== '') {
      phoneFax = primaryPhone;
    }

    let add_ph = {
      patientId: this.current_user.patientId,
      name: storeName,
      city: city,
      state: state,
      zip: zipCode,
      phoneOrFax: phoneFax,
      Address1: address1,
      PharmacyId: '' + pharmacyId
    }
    /*this.authService.post('patient/addPatientPharmacy', add_ph).then((result) => {
      this.authService.hideLoader();
      this.responded_data = result;
      if (this.responded_data.code == 200) {
        localStorage.setItem('pharmacy_add', '1');
        this.authService.presentAlert("Success", "Farmacia añadido con éxito.", "Ok");
      } else if (this.responded_data.code == 208) {
        this.authService.presentAlert("Error", "Farmacia ya agregada para este paciente..", "Ok");
      }
    }, (err) => {
      console.log("Something wrong...");
    });*/
  }


  closeAllInfoWindows() {
    for (let window of this.infoWindows) {
      window.close();
    }
  }

  addMarkersToMap(markers) {
    for (let marker of markers) {
      var position = new google.maps.LatLng(marker.Latitude, marker.Longitude);
      var dogwalkMarker = new google.maps.Marker({
        position: position,
        title: marker.StoreName,
        icon: 'assets/img/marker.png'
      });
      dogwalkMarker.setMap(this.map);
      this.addInfoWindowToMarker(dogwalkMarker, marker.PharmacyId, marker.City, marker.State, marker.Address1, marker.ZipCode, marker.PrimaryPhone);
    }
  }

  tryGeolocation() {
    this.clearMarkers();
    /*this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      this.map.setCenter(pos);
    }).catch((error) => {
      console.log('Error getting location', error);
    });*/
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        // let position = {
        //     lat: results[0].geometry.location.lat,
        //     lng: results[0].geometry.location.lng
        // };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }


  /* museums (){
    this.museumList = [
      {
        "name": "National Museum",
        "state" : "Delhi",
        "latitude": 28.6117993,
        "longitude": 77.2194934
      },
      {
        "name": "National Science Centre,",
        "state": "Delhi",
        "latitude": 28.6132098,
        "longitude": 77.245437
      },
      {
        "name": "The Sardar Patel Museum",
        "state": "Gujrat",
        "latitude": 21.1699005,
        "longitude": 72.7955734
      },
      {
        "name": "Library of Tibetan Works and Archives",
        "state": "Himachal",
        "latitude": 32.2263696,
        "longitude": 76.325326

      },
      {
        "name": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
        "state": "Maharashtra",
        "latitude": 18.926873,
        "longitude": 72.8326132
      },
      {
        "name": "Namgyal Institute of Tibetology",
        "state": "Sikkim",
        "latitude": 27.315948,
        "longitude": 88.6047829

      }
    ];
  } */



}
