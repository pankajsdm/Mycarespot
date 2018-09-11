import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavParams, ToastController, LoadingController, NavController, AlertController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { LoginPage } from '../login/login';
 
@Component({
  selector: 'page-add-minor',
  templateUrl: 'add-minor.html',
})
export class AddMinorPage {

  create_profile: string = "create";  
  public registerForm: FormGroup;
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
    public navCtrl: NavController, public navParams: NavParams
  ) {
      this.registerForm = this.formdata.group({
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        email: [''],
        DateOfBirth: ['', [Validators.required]],
        social_security: ['', [Validators.required]],
        Gender: ['', [Validators.required]],
        relationship: ['', [Validators.required]]
      });
   
  }           
  

  get check() { return this.registerForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAccountPage');
    this.user.relationship = 'Brother';
    
  }

  

}
