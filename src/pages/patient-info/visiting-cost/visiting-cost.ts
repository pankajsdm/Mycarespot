import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { DoctorsPage } from "../../doctors/doctors";
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { CardInfoPage } from './../../patient-info/visiting-cost/card-info/card-info';
import { Stripe } from '@ionic-native/stripe';

@Component({
  selector: 'page-visiting-cost',
  templateUrl: 'visiting-cost.html',
}) 
export class VisitingCostPage {

  stripeToken: any;
  user_data: any = {firstName: '', lastName: ''};
  user_picture: String;
  card: any;
  cardArr: any;
  cardinfo: any = {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2020,
    cvc: '220'
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private stripe: Stripe,
    private event: Events,
    public authService: CommonServiceProvider
  ) {
  }    

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCostPage');
    this.user_picture = localStorage.getItem('user_picture');   
    this.user_data   = JSON.parse(localStorage.getItem('user_data'));    
    this.getCard();

    this.event.subscribe('isCreated', (paramsVar) => {
      if(paramsVar){
        this.getCard();
      }
    });
  }

  getCard(){
    this.authService.showLoader();
    this.authService.get('users/getSavedCardDetailsForPatients/'+this.user_data.patientId).then( (result) => {
      this.authService.hideLoader();
      this.cardArr = result;
      this.card = this.cardArr.data;
    });
  } 

  addCard(){
    this.navCtrl.push(CardInfoPage);
  }

  makePayment(){
    console.log("Payment is under construction...");
  }

  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
  }

}
