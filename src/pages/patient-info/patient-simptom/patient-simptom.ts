
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RiskFactorsPage } from '../risk-factors/risk-factors';


@Component({
  selector: 'page-patient-simptom',
  templateUrl: 'patient-simptom.html',
})
export class PatientSimptomPage {

  public registerForm: FormGroup;
  public user: any = {};
  registration_type: boolean;
  reg_param: string;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;

  constructor(
    public viewCtrl: ViewController,
    public formdata: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams
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
    });
    this.viewCtrl.setBackButtonText('Cancel');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientSimptomPage');
    this.user.country_code = 'PR +1';
  }


  riskFactors(){
    this.navCtrl.push(RiskFactorsPage);
  }

}
