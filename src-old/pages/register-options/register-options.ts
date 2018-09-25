import { Component } from '@angular/core';
import { Events, NavParams, ToastController, AlertController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginPage } from '../login/login';
import { RegisterAccountPage } from '../register-account/register-account'
import { CommonServiceProvider } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-register-options',
  templateUrl: 'register-options.html',
})
export class RegisterOptionsPage {

  private fb: any;
  isLoggedIn:boolean = false;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;

  constructor(
    fb: Facebook,
    private alertCtrl: AlertController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController) {
      this.fb = fb; 
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOptionsPage');
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

   /* Pubslish event on each update */
   publish_events(data){
    this.events.publish('user:update', data);
  }


  goToLogin(){
    this.navCtrl.push(LoginPage); 
  }     

  register(type) { 
    this.navCtrl.push(RegisterAccountPage, {type: type});
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
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
    

  attached(p){}

}
