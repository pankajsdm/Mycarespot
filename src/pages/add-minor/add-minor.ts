
import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Events, NavParams, ToastController, LoadingController, NavController, AlertController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { LoginPage } from '../login/login';
import { PatientInfoPage } from './../patient-info/patient-info';

@Component({
  selector: 'page-add-minor',
  templateUrl: 'add-minor.html',
})
export class AddMinorPage {

  create_profile: string = "create";  
  public registerForm: FormGroup;
  public linkForm: FormGroup;
  public user: any = {};
  public linker: any = {'email': ''};
  public relationId = '';
  current_user: any;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  constructor(
    private event: Events,
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
        social_security: ['', [Validators.required]],
        Gender: ['', [Validators.required]],
        relationship: ['', [Validators.required]]
      });

      const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.linkForm = this.formdata.group({
        email: ['', [Validators.required, Validators.pattern(pureEmail)]]
      });
   
  }           
  

  get check() { return this.registerForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMinorPage');
    this.user.relationship = 'Brother';
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
  }

  submitRegistration(){
    
    if(this.registerForm.valid){
      let user = {
        FirstName: this.registerForm.get('FirstName').value,
        LastName: this.registerForm.get('LastName').value,
        DateOfBirth: this.registerForm.get('DateOfBirth').value,
        Gender: this.registerForm.get('Gender').value,
        Socialsecuritynumber: this.registerForm.get('social_security').value,
        relationshipToMinor: this.registerForm.get('relationship').value,
      }
      this.showLoader();
      this.authService.post('patient/addMinorAccount', user).then((result) => {
        this.loading.dismiss();
        this.user = result;
        this.relationId = this.user.data.relationId;
        if(this.user.code==200){
          this.create_profile = 'link';
        }else{
          this.presentToast('Something wrong! Please try later.');
        }

      },(err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong! Please try later.');
      });
    }
  }

  submitEmailLink(){
    console.log("link form submitted");
    
    if(this.linkForm.valid){

      if(this.relationId==''){
        this.presentToast('Por favor crea una relación primero.');
      }else{
        let user = {
          relationId: this.relationId,
          userId: this.current_user._id,
          email: this.linkForm.get('email').value,
        }
        this.showLoader();
        this.authService.post('patient/sendMailToGuardian', user).then((result) => {
          this.loading.dismiss();
          this.user = result;
          if(this.user.code==200){
            this.presentToast(this.user.message);
            setTimeout(() => {
              this.navCtrl.pop().then( () => {
                this.event.publish('submitted', true);
              });
            }, 1000);
          }else{
            this.presentToast('Something wrong! Please try later.');
          }
        },(err) => {
          this.loading.dismiss();
          this.presentToast('Something wrong! Please try later.');
        });
      }
    }
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
      position: 'middle',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  

}
