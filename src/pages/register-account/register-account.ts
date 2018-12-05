

import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavParams, ViewController, ModalController, ToastController, LoadingController, NavController, AlertController, Keyboard } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { PasswordValidation } from '../../validators/password.validator';
import { LoginPage } from '../login/login';
import { CountryCodePage } from './country-code/country-code';
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
let self;

@Component({
  selector: 'page-register-account',
  templateUrl: 'register-account.html',
})
export class RegisterAccountPage {

  
  public registerForm: FormGroup;
  public verifyForm: FormGroup;
  public user: any = {};
  verificationProcess: boolean = false;
  public verf: any = {code: ''};
  registration_type: boolean;
  reg_param: string;
  cellphone: Number;
  register_id: string;
  set_country_code: string = '+1';
  set_country_with_code: string = 'PR +1';
  isSubmitted: boolean = false;
  isSubmittedVrfToken: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  selectedPicture: any = 'assets/img/circle_plus.png';
  file_data = '';
  filechooser:Boolean = false;

  constructor(
    private keyboard: Keyboard,
    private http: HttpClient,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public formdata: FormBuilder,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
      self = this;
      this.verifyForm = this.formdata.group({
        code: ['', [Validators.required]],
      }); 

      this.registerForm = this.formdata.group({
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        DateOfBirth: ['', [Validators.required]],
        email: [''],
        mobilePhone: [''],
        Gender: ['', [Validators.required]],
        password: ['', [Validators.required]],
        c_password: ['', [Validators.required]],
      },{
        validator: PasswordValidation.MatchPassword
      });
  }
 
  get check() { return this.registerForm.controls; }
  get vrfToken() { return this.verifyForm.controls; }

  presentProfileModal() {
    let profileModal = this.modalCtrl.create(CountryCodePage);
    profileModal.onDidDismiss(data => {
      let spt = data.code.split('+');
      this.set_country_code = '+'+spt[1];
      //this.set_country_with_code = spt[0]+' +'+spt[1];
      this.set_country_with_code = spt[1];
    });
    profileModal.present();
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAccountPage');
    console.log(this.navParams.get('type'));

    this.reg_param = this.navParams.get('type');
    if(this.reg_param=='mail'){
      const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.registration_type = true;
      this.registerForm.controls['email'].setValidators([Validators.required, Validators.pattern(pureEmail)]);
      this.registerForm.controls['mobilePhone'].clearValidators();

    }else{
      this.registration_type = false;
      this.registerForm.controls['mobilePhone'].setValidators([Validators.required]);

      this.registerForm.controls['email'].clearValidators();
    } 
    this.registerForm.controls['email'].updateValueAndValidity();
    this.registerForm.controls['mobilePhone'].updateValueAndValidity();
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  uploadImage(event) {
    let file = event.srcElement.files[0];
    this.file_data = file;
    if (!file) return;
    this.filechooser = true;
    console.log("file", file);
    this.getBase64(file).then( (picture) => {
      console.log(">>>>>>>>>>>:: ", this.selectedPicture)
      this.selectedPicture = picture; 
      console.log(":::::::::::::::::::::::::: ", this.selectedPicture)
    });

  }

 

  goToLogin() { 
    this.navCtrl.push(LoginPage); 
  }

  submitRegistration(){
    this.isSubmitted = true;
    if(this.registerForm.valid && this.filechooser){
      this.showLoader();
      let api_url;
      let formData: FormData = new FormData();
      let headers = new Headers();
      if(this.reg_param=='mail'){
        formData.append("email", this.user['email']);
        api_url = 'patient/registerMobileUserByEmail';
        delete this.user.mobilePhone;
      }else{
        api_url = 'patient/registerMobileUserByMobileNumber';
        delete this.user.email;
        this.user.countryCode = this.set_country_with_code;
        formData.append("countryCode", this.set_country_with_code);
      }
      formData.append('file', this.file_data);
      formData.append('FirstName', this.user['FirstName']);
      formData.append("MiddleName", this.user['MiddleName']);
      formData.append("LastName", this.user['LastName']);
      formData.append("DateOfBirth", this.user['DateOfBirth']);
      formData.append("Gender", this.user['Gender']);
      formData.append("password", this.user['password']);
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      
      self.http.post(Config.api_url+'patient/registerMobileUserByEmail', formData)
      .subscribe(res => {
        this.loading.dismiss();
        this.user_data = res; 
        if(this.user_data.code==200){
          if(this.reg_param=='mail'){
            this.presentAlert('Success', this.user_data.message)
            setTimeout(() => {
              this.navCtrl.setRoot(LoginPage);
            }, 1000);
          }else{
            this.mobile_verification_html(this.user.mobilePhone, this.user_data.data._id);
          }
        }else{
          this.presentAlert('Error', this.user_data.message)
        }
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });

      /* this.authService.post(api_url, this.user).then((result) => {
        this.loading.dismiss();
        this.user_data = result;  
        if(this.user_data.code==200){
          if(this.reg_param=='mail'){
            this.presentAlert('Success', this.user_data.message)
            setTimeout(() => {
              this.navCtrl.setRoot(LoginPage);
            }, 1000);
          }else{
            this.mobile_verification_html(this.user.mobilePhone, this.user_data.data._id);
          }
        }else{
          this.presentAlert('Error', this.user_data.message)
        }   
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      }); */
    } 
  }     

  mobile_verification_html(mobilePhone, _id){
    this.verificationProcess = true;
    this.cellphone = mobilePhone;
    this.register_id = _id;
  }
   
  tokenVerification(){
    if(this.verifyForm.valid){
      console.log(this.verf);
      this.verf['_id'] = this.register_id;
      this.verf['mobileNumber'] = this.cellphone;
      this.authService.fetch('verifyMobileNumber', this.verf).then((result) => {
        this.loading.dismiss();
        console.log("new code", result);
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

