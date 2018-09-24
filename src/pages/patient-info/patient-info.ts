import { Component } from '@angular/core';
import { Events, ToastController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AddMinorPage } from '../add-minor/add-minor';
import { PatientSimptomPage } from '../patient-info/patient-simptom/patient-simptom';
import { CommonServiceProvider } from '../../providers/common-service/common-service';


@Component({
  selector: 'page-patient-info',
  templateUrl: 'patient-info.html',
})
export class PatientInfoPage {

  registerForm: FormGroup;
  users: any;
  prctArr: any;
  isSubmittedMinor: boolean =  false;
  defaultPatient: String;
  registration_type: boolean;
  reg_param: string;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;

  constructor(
    private event: Events,
    public loadingCtrl: LoadingController,
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
    this.getMinorList();
    this.event.subscribe('submitted', (paramsVar) => {
      if(paramsVar){
        this.getMinorList();
      }
    });
  }

  getMinorList(){   
    if(this.online){
      this.showLoader();
      this.authService.get('practioner/getAddedMinorsList').then((result) => {
        this.loading.dismiss();
        this.prctArr = result;  
        this.users = this.prctArr.data.children;
        this.defaultPatient =  this.prctArr.data._id.name;
        console.log("user", this.users);
      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }


  add_minor(){
    this.navCtrl.push(AddMinorPage);
  }

  simptoms(){
    this.navCtrl.push(PatientSimptomPage);
  }

  /* Show prgoress loader*/
  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
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

}
