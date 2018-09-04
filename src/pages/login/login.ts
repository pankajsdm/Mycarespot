import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Events, NavParams, ToastController, AlertController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FeedPage } from '../feed/feed';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { RecoveryPasswordPage } from '../recovery-password/recovery-password';
import { RegisterOptionsPage } from '../register-options/register-options';
import { CommonServiceProvider } from '../../providers/common-service/common-service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private fb: any;
  isLoggedIn:boolean = false;
  public loginForm: FormGroup;
  public user =  {email: 'rafael@yomail.com', password: '123456'};
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;

  constructor(
    fb: Facebook,
    private alertCtrl: AlertController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public formdata: FormBuilder,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController
  ) {
    this.fb = fb;
    this.menu.enable(false);
    const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.loginForm = this.formdata.group({
      email: ['', [Validators.required, Validators.pattern(pureEmail)]],
      password: ['', [Validators.required]],
    });
    
  }

  get check() { return this.loginForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  login(){
    this.isSubmitted = true;
    if(this.online){
      if(this.loginForm.valid){
        this.showLoader();
        this.authService.post('patient/mobileUserLogin', this.user).then((result) => {
        //this.authService.fetch('auth/local', this.user).then((result) => {
          this.loading.dismiss();
          this.user_data = result;  
          if(this.user_data.code==200){ 
            console.log("this.user_data", this.user_data.data);
            console.log("this.token", this.user_data.token);
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
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }

  /* Pubslish event on each update */
  publish_events(data){
    this.events.publish('user:update', data);
  }
 
  goToRecovery() { 
    this.navCtrl.push(RecoveryPasswordPage); 
  }

  goToRegister() { 
    this.navCtrl.push(RegisterOptionsPage); 
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

  presentAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Ok']
    });
    alert.present();
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
