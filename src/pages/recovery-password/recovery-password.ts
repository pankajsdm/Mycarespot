import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController, NavParams, ToastController, LoadingController, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {

  public resetForm: FormGroup;
  public user: any = {};
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
    public menu: MenuController,
    public navCtrl: NavController, public navParams: NavParams
  ) {

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
      console.log(this.user);
    }else{
      this.presentAlert('Error', 'Please enter mobile or cellphone number');
    }
  }

  goToLogin() { 
    this.navCtrl.push(LoginPage); 
  }

  facebook(){
  }

  presentAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }


}
