import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AddMinorPage } from '../add-minor/add-minor';
import { PatientSimptomPage } from '../patient-info/patient-simptom/patient-simptom';

@Component({
  selector: 'page-patient-info',
  templateUrl: 'patient-info.html',
})
export class PatientInfoPage {

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
    console.log('ionViewDidLoad PatientInfoPage');
    this.user.country_code = 'PR +1';
  }

  add_minor(){
    this.navCtrl.push(AddMinorPage);
  }

  simptoms(){
    this.navCtrl.push(PatientSimptomPage);
  }

}
