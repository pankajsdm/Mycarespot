import { Component } from "@angular/core";
import {ToastController,NavController,MenuController,NavParams} from "ionic-angular";
import { CommonServiceProvider } from "../../../../providers/common-service/common-service";

@Component({
  selector: 'page-diagnostics',
  templateUrl: 'diagnostics.html',
})
export class DiagnosticsPage {
 
  online: Boolean = true;
  loading: any;
  diagArr: any;
  diagList: any; 
  currentUser: any;
  no_data_found: String = '';
  type: String;
  title: String;
  isLoading: Boolean = false;
  pmh = {
    mayor_event: 'Loading...',
    developmental_history: 'Loading...',
    nutrition_history: 'Loading...',
    social_history: 'Loading...',
    preventive_care: 'Loading...',
    family_health_history: 'Loading...',
    on_going_medical_problem: 'Loading...',
  }

  constructor( 
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public navParams: NavParams,) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad DiagnosticsPage');
    this.currentUser = JSON.parse(localStorage.getItem('user_data'));
    this.type = this.navParams.get('type');
    console.log("type", this.type);

    if(this.type=='diagnostics'){
      this.title = 'Diagnósticos';
      this.diagnosis(this.currentUser.patientId);
    }else if(this.type=='social_history'){
      this.title = 'Historia social';
      this.social_history(this.currentUser.patientId);
    }else if(this.type=='past_medical_history'){
      this.title = 'Historia médica pasada';
      this.past_medical_history(this.currentUser.patientId);
    }else if(this.type=='allergies'){
      this.title = 'Alergias';
      this.alergias(this.currentUser.patientId);
    }else if(this.type=='medications'){
      this.title = 'Medicamentos';
      this.medications(this.currentUser.patientId);
    }
  }
 
  diagnosis(_id) {
    if (this.online) {
      this.isLoading = true;
      this.authService.get('diagnosis/getDiagnosis/' + _id).then(result => {
        this.isLoading = false;
        this.diagArr = result;
        this.diagList = this.diagArr.data;
        if(this.diagList.length==0){
          this.no_data_found = 'Datos no encontrados...';
        }
      });
    }
  }

  social_history(_id) {
    if (this.online) {
      this.isLoading = true;
      this.authService.get('patient/getSocialHistory/' + _id).then(result => {
        this.isLoading = false;
        this.diagArr = result;
        this.diagList = this.diagArr.data;
        if(this.diagList.length==0){
          this.no_data_found = 'Datos no encontrados...';
        }
      });
    }
  }

  past_medical_history(_id){
    if (this.online) {
      this.isLoading = true;
      this.authService.get('patient/getPastMedicalHistory/' + _id).then(result => {
        this.isLoading = false;
        this.diagArr = result;
        this.pmh = {
          mayor_event: (this.diagArr.data.mayor_event)?this.diagArr.data.mayor_event:'Not applicable',
          developmental_history: (this.diagArr.data.developmental_history)?this.diagArr.data.developmental_history:'Not applicable',
          nutrition_history: (this.diagArr.data.nutrition_history)?this.diagArr.data.nutrition_history:'Not applicable',
          social_history: (this.diagArr.data.social_history)?this.diagArr.data.social_history:'Not applicable',
          preventive_care: (this.diagArr.data.preventive_care)?this.diagArr.data.preventive_care:'Not applicable',
          family_health_history: (this.diagArr.data.family_health_history)?this.diagArr.data.family_health_history:'Not applicable',
          on_going_medical_problem: (this.diagArr.data.on_going_medical_problem)?this.diagArr.data.on_going_medical_problem:'Not applicable'
        }
      });
    }
  }

  alergias(_id) {
    if (this.online) {
      this.isLoading = true;
      this.authService.get('users/getPatientAlergy/' + _id).then(result => {
        this.isLoading = false;
        this.diagArr = result;
        this.diagList = this.diagArr.data;
        if(this.diagList.length==0){
          this.no_data_found = 'Datos no encontrados...';
        }
      });
    }
  }

  medications(_id) {
    if (this.online) {
      this.isLoading = true;
      this.authService.get('patient/getPatientSelfMedicationList/' + _id).then(result => {
        this.isLoading = false;
        this.diagArr = result;
        this.diagList = this.diagArr.data;
        
        if(this.diagList.length==0){
          this.no_data_found = 'Datos no encontrados...';
        }
      });
    }
  }


  /* Creating toast */
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: "bottom",
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });
    toast.present();
  }


}
