import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Events, AlertController, NavParams, ToastController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { LoginPage } from '../login/login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {

  public resetForm: FormGroup;
  public user: any = {};
  private fb: any;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  constructor(
    fb: Facebook,
    public events: Events,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public formdata: FormBuilder,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
      this.fb = fb;
      this.resetForm = this.formdata.group({
        email_cellphone: ['', [Validators.required]]
      });
  }

  get check() { return this.resetForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPage');
  }


  submitReset(){
    this.isSubmitted = true;
    if(this.resetForm.valid){
      this.showLoader();
      let json = {mobilePhone: this.user.email_cellphone};
      this.authService.post('patient/sentVerficationCodeToMobileNumber', json).then((result) => {
        this.loading.dismiss();
        this.user_data = result;  
        console.log("this.user_data", this.user_data);
        if(this.user_data.code==200){ 
          this.presentAlert('Success', 'Restablecer contraseña exitosamente Por favor revise su correo electrónico.');
          setTimeout(() => {
            this.navCtrl.setRoot(LoginPage);
          }, 1000);
          
        }else{
          this.presentAlert('Error', this.user_data.message);
        }
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });

    }else{
      this.presentAlert('Error', 'Please enter mobile or cellphone number');
    }
  }

  goToLogin() { 
    this.navCtrl.push(LoginPage); 
  }

  facebook(){
    console.log("I am facebook login");
    this.fb.login(['public_profile', 'user_friends', 'email'])  
    .then((res: FacebookLoginResponse) => {
      console.log("status", res.status);
      console.log("status", res.authResponse.accessToken);
      console.log("status", res.authResponse.userID);

      if (res.status == 'connected') {
        this.fb.api("/me/?fields=id,email,last_name,first_name", ["public_profile", "email"]).then(
          fbUser => {
            this.connectDb(res.authResponse.accessToken, fbUser.id, fbUser.first_name, fbUser.last_name, fbUser.email);
          },  
          error => {
            console.log('error1', error);
          }
        ) 
      }
    })  
    .catch(e => console.log('Error logging into Facebook', e));
  }

  presentAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  connectDb(token, id, first_name, last_name, email){
    this.showLoader();
    let name = first_name+' '+last_name;
    let json =   {
      email: email,
      name: name,
      provider : 'facebook',
      provider_id : id,
      provider_pic: "",
      token: token
    };

    this.authService.post('patient/facebookLogin', json).then((result) => {
      this.loading.dismiss();
      this.user_data = result;  
      if(this.user_data.code==200){ 
        this.menu.enable(true); 
        localStorage.setItem('user_data', JSON.stringify(this.user_data.data));
        localStorage.setItem('token', this.user_data.token);
        this.publish_events(this.user_data.data);
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.presentAlert('Error', this.user_data.message);
      }
    },(err) => {
      this.loading.dismiss();
      this.presentToast('Something wrong! Please try later.');
    });
  }

  /* Pubslish event on each update */
  publish_events(data){
    this.events.publish('user:update', data);
  }


  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }
 
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
