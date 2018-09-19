import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Events, AlertController, NavParams, ToastController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { LoginPage } from '../login/login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { PasswordValidation } from '../../validators/password.validator';

@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {

  public resetForm: FormGroup;
  public verifyForm: FormGroup;
  public passwordForm: FormGroup;
  public user: any = {};
  public verf: any = {code: ''};
  public change: any = {password: '', c_password: ''};
  resetProcess: boolean = false;
  passwordProcess: boolean = false;
  cellphone: Number;
  register_id: string;
  
  private fb: any;
  isSubmitted: boolean = false;
  isSubmittedVrfToken: boolean = false;
  isPasswordSubmitted: boolean = false;
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

      this.verifyForm = this.formdata.group({
        code: ['', [Validators.required]],
      }); 

      this.passwordForm = this.formdata.group({
        password: ['', [Validators.required]],
        c_password: ['', [Validators.required]]
      },{
        validator: PasswordValidation.MatchPassword
      }); 

  }       

  get check() { return this.resetForm.controls; }
  get vrfToken() { return this.verifyForm.controls; }
  get reset() { return this.passwordForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPage');
  }


  submitReset(){
    this.isSubmitted = true;
    
    if(this.resetForm.valid){
      this.showLoader();
      let json = {mobilePhone: this.user.email_cellphone};
      this.authService.post('patient/resetPasswordByMobile', json).then((result) => {
        this.loading.dismiss();
        this.user_data = result;  
        console.log("this.user_data", this.user_data);
        if(this.user_data.code==200){
          this.mobile_verification_html(this.user.email_cellphone, this.user_data.data._id);
        }else{
          this.presentAlert('Error', this.user_data.message)
        } 
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });

    }else{
      this.presentAlert('Error', 'Please enter mobile or cellphone number');
    }
  }

  mobile_verification_html(mobilePhone, _id){
    this.resetProcess = true;
    this.cellphone = mobilePhone;
    this.register_id = _id;
  }

  tokenVerification(){
    this.isSubmittedVrfToken = true;
    if(this.verifyForm.valid){
      this.verf['_id'] = this.register_id;
      this.verf['mobileNumber'] = this.cellphone;
      this.authService.fetch('verifyMobileNumber', this.verf).then((result) => {
        this.loading.dismiss();
        console.log("new code", result);
        this.user_data = result
        if(this.user_data.code==200){
          this.resetProcess = false;
          this.passwordProcess = true;  
        }else{
          this.presentAlert('Error', this.user_data.message)
        }
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }
  } 

  setPassword(){
    this.isPasswordSubmitted = true;
    if(this.passwordForm.valid){
      console.log("change.password", this.change);
      this.change['token'] = this.verf.code;
      this.authService.fetch('resetPasswordThroughToken', this.change).then((result) => {
        this.loading.dismiss();
        this.user_data = result
        if(this.user_data.code==200){
          this.presentAlert('Success', this.user_data.message)
          setTimeout(() => {
            this.navCtrl.setRoot(LoginPage);
          }, 1000);
        }else{
          this.presentAlert('Error', this.user_data.message)
        }
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
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
