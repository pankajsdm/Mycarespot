import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController } from 'ionic-angular';
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
  user_data: any = { firstName: '', lastName: '' };
  user_picture: String;
  card: any;
  payment: any;
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
    public authService: CommonServiceProvider,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCostPage');
    this.user_picture = localStorage.getItem('user_picture');
    this.user_data = JSON.parse(localStorage.getItem('user_data'));
    this.getCard();

    this.event.subscribe('isCreated', (paramsVar) => {
      if (paramsVar) {
        this.getCard();
      }
    });
  }

  getCard() {
    this.authService.showLoader();
    this.authService.get('users/getSavedCardDetailsForPatients/' + this.user_data.patientId).then((result) => {
      this.authService.hideLoader();
      this.cardArr = result;
      this.card = this.cardArr.data;
    });
  }

  addCard() {
    this.navCtrl.push(CardInfoPage);
  }

  makePayment(customer_id) {
    console.log("Payment is under construction...", customer_id);
    this.authService.showLoader();
    let payment_data = {
      amount: "20",
      currency: "usd",
      description: "This is the test payment",
      customer: customer_id
    };
    this.authService.post('payment/createPayment', payment_data).then((result) => {
      this.authService.hideLoader();
      console.log("The payment status", result);
      this.payment = result;
      if (this.payment.data.status == 'succeeded') {
        this.authService.presentAlert('Success', 'payment successfully made...', 'Ok');
      } else {
        this.authService.presentAlert('Error', 'Problem to make payment...', 'Dismiss');
      }
    }, (err) => {
      this.authService.presentAlert('Error', 'Something wrong. Please try later.', 'Dismiss');
      this.authService.hideLoader();
    });
  }

  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if (this.authService.action) {
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);
  }

  removeCard(stripe_customer_id, card_id) {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Te redirige en la pantalla del doctor.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log("clicked no")
            // this.action = false;
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log("clicked yes")
            let data: any = {
              stripe_customer_id: stripe_customer_id,
              card_id: card_id
            }
            this.deleteCard(data);
            // this.action = true;
          }
        }
      ]
    });
    alert.present()
  }

  deleteCard(data) {
    this.authService.showLoader();
    this.authService.post('payment/deleteCard', data).then((result : any) => {
      this.authService.hideLoader();       
      if (result.code == 200) {
        this.authService.presentToast(result.message, 'middle');        
      } else {
        this.authService.presentToast(result.message, 'bottom');
      }
    }, (err) => {
      this.authService.presentToast("Something went wrong...", 'bottom');
    });
  }

}
