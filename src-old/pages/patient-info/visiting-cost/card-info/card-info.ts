import { Component } from '@angular/core';
import { Events, NavController, NavParams, ModalController } from 'ionic-angular';
import { DoctorsPage } from "../../../doctors/doctors";
import { Stripe } from '@ionic-native/stripe';
import { VitalsChooserPage } from './../../vitals/vitals-chooser/vitals-chooser';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
 

@Component({
  selector: 'page-card-info',
  templateUrl: 'card-info.html',
}) 
export class CardInfoPage {

  public cardForm: FormGroup;
  user_data: any;
  user_picture: String;
  customer: any = {id: ''};
  res: any;
  isSubmitted: boolean = false;
  card: any = { number: '', expMonth: '', expYear: '', cvc: ''};
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formdata: FormBuilder,
    private stripe: Stripe,
    private event: Events,
    public modalCtrl: ModalController,
    public authService: CommonServiceProvider
  ) { 

    this.cardForm = this.formdata.group({
      number: ['', [Validators.required]],
      expMonth: ['', [Validators.required]],
      expYear: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    }); 
  }   
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCostPage');
    this.user_picture = localStorage.getItem('user_picture');    
    this.user_data   = JSON.parse(localStorage.getItem('user_data'));    

    
  }

  choose(val){
    let profileModal = this.modalCtrl.create(VitalsChooserPage, { value: val });
    profileModal.onDidDismiss(data => {
      if(val=='months'){
        this.card.expMonth = data.code;
      }else if(val=='years'){
        this.card.expYear = data.code;
      }
    });
    profileModal.present();
  }

  get check() { return this.cardForm.controls; }

  saveCard(){
    this.isSubmitted = true;
    if(this.cardForm.valid){
      this.authService.showLoader();
      this.stripe.setPublishableKey('pk_test_2wmvXUXermvXMepFVD0rFGpP');
      this.stripe.createCardToken(this.card).then((token) => {
        console.log("Token It is", token.id);
        
        let data = {     
          email: this.user_data.email, 
          cardToken: token.id,
          patient_genral_info_id: this.user_data.patientId,
          created_by_user_id: this.user_data._id
        }      
        this.authService.post('payment/createCard', data).then((result) => {
          this.authService.hideLoader();
          this.res = result;  
          this.customer = this.res.data;
          if(this.res.code==200){
            this.authService.presentToast("Card added successfully...", 'middle');
            setTimeout(() => {
              this.navCtrl.pop().then( () => {
                this.event.publish('isCreated', true);
              });
            }, 1000); 
          }else{
            this.authService.presentToast("Card information is wrong...", 'bottom');
          } 
        },(err) => {  
          this.authService.presentToast("Card information is wrong...", 'bottom');
        });
      }); 
    }

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
