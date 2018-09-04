
import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavParams, ToastController, LoadingController, NavController, AlertController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { PasswordValidation } from '../../validators/password.validator';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register-account',
  templateUrl: 'register-account.html',
})
export class RegisterAccountPage {

  
  public registerForm: FormGroup;
  public user: any = {};
  registration_type: boolean;
  reg_param: string;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  constructor(
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public formdata: FormBuilder,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams
  ) {

      this.registerForm = this.formdata.group({
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        DateOfBirth: ['', [Validators.required]],
        email: [''],
        mobilePhone: [''],
        country_code: [''],
        Gender: ['', [Validators.required]],
        password: ['', [Validators.required]],
        c_password: ['', [Validators.required]],
      },{
        validator: PasswordValidation.MatchPassword
      });
  }

  get check() { return this.registerForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAccountPage');
    console.log(this.navParams.get('type'));
    this.user.country_code = 'PR +1';
    this.reg_param = this.navParams.get('type');
    if(this.reg_param=='mail'){
      const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.registration_type = true;
      this.registerForm.controls['email'].setValidators([Validators.required, Validators.pattern(pureEmail)]);
      this.registerForm.controls['mobilePhone'].clearValidators();
      this.registerForm.controls['country_code'].clearValidators();
    }else{
      this.registration_type = false;
      this.registerForm.controls['mobilePhone'].setValidators([Validators.required]);
      this.registerForm.controls['country_code'].setValidators([Validators.required]);
      this.registerForm.controls['email'].clearValidators();
    }
    this.registerForm.controls['email'].updateValueAndValidity();
    this.registerForm.controls['mobilePhone'].updateValueAndValidity();
    this.registerForm.controls['country_code'].updateValueAndValidity();
  }

  goToLogin() { 
    this.navCtrl.push(LoginPage); 
  }

  submitRegistration(){
    this.isSubmitted = true;
    if(this.registerForm.valid){
      this.showLoader();
      let api_url;
      if(this.reg_param=='mail'){
        api_url = 'patient/registerMobileUserByEmail';
        delete this.user.mobilePhone;
      }else{
        api_url = 'patient/registerMobileUserByMobileNumber';
        delete this.user.email;
        this.user.countryCode = this.user.country_code;
      }
      console.log(this.user);
      this.authService.post(api_url, this.user).then((result) => {
        this.loading.dismiss();
        this.user_data = result;  
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
