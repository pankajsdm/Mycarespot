import { Component } from '@angular/core';
import { Events, ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AddMinorPage } from '../add-minor/add-minor';
import { PatientSimptomPage } from './patient-simptom/patient-simptom';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { OptionsSimptomPage } from './options-simptom/options-simptom';
import { DoctorsPage } from "../doctors/doctors";
  
@Component({
  selector: 'page-patient-info',
  templateUrl: 'patient-info.html',
})
export class PatientInfoPage {

  registerForm: FormGroup;
  users: any;
  prctArr: any;
  isSubmittedMinor: boolean =  false;
  defaultPatient = {name: '', _id: ''};
  registration_type: boolean;
  reg_param: string;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  user_picture: String;
  isLoading: Boolean = false;

  constructor(
    private event: Events,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public formdata: FormBuilder,
    public navParams: NavParams
  ) {
     
    this.registerForm = this.formdata.group({
      FirstName: ['', [Validators.required]],
    });
  }

 

  ionViewDidLoad() {

    console.log('ionViewDidLoad PatientInfoPage');
    this.user_picture = localStorage.getItem('user_picture');   
    this.getMinorList();
    this.event.subscribe('submitted', (paramsVar) => {
      if(paramsVar){
        this.getMinorList();
      }
    });
  }

  getMinorList(){   
    if(this.online){
      this.isLoading = true;
      this.authService.get('practioner/getAddedMinorsList').then((result) => {
        this.isLoading = false;
        this.prctArr = result;  
        this.users = this.prctArr.data.children;
        this.defaultPatient =  this.prctArr.data._id;
        console.log("user", this.users);
      },(err) => {
        this.isLoading = false;
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }

  cancle(){
    this.navCtrl.setRoot(DoctorsPage);
  }


  add_minor(){
    this.navCtrl.push(AddMinorPage);
  }

  /* simptoms(id){
    this.navCtrl.push(PatientSimptomPage);
  } */

  optionSimptom(id){
    this.navCtrl.push(OptionsSimptomPage);
  }


  /* Creating toast */
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

 ionViewDidEnter(){
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = 'none';
    }
  }
 
}
