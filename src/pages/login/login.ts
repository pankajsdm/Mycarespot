import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Events, NavParams, ToastController, AlertController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FeedPage } from '../feed/feed';
import { RecoveryPasswordPage } from '../recovery-password/recovery-password';
import { RegisterOptionsPage } from '../register-options/register-options';
import { CommonServiceProvider } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public user =  {email: 'ankur.arora@yopmail.com', password: 'Password@123'};
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;

  constructor(
    private alertCtrl: AlertController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public formdata: FormBuilder,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
  ) {
    
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
