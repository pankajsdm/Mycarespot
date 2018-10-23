import { Component } from '@angular/core';
import { ToastController,  NavController, MenuController } from 'ionic-angular';
import { DoctorProfilePage } from './../doctor-profile/doctor-profile';
import { CommonServiceProvider } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-doctors',
  templateUrl: 'doctors.html',
})
export class DoctorsPage {

  online: Boolean = true;
  loading: any;
  doctrArr: any;
  doctors: any;
  isLoading: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
  ) {
  }
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorsPage');
    this.getDoctors();
  }
     
  getDoctors(){
    if(this.online){  
      this.isLoading = true;
        this.authService.get('users/getPRactionerList').then((result) => {
          this.isLoading = false;
          this.doctrArr = result;  
          this.doctors = this.doctrArr.data; 
          console.log("doctors", this.doctors);
        },(err) => {
          this.isLoading = false;
          this.presentToast('Something wrong! Please try later.');
        });
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }   
   
  docProfile(_id, pic){
    localStorage.setItem('user_picture', pic);
    this.navCtrl.push(DoctorProfilePage, {
      _id: _id
    });
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

  ionViewDidEnter() {
    console.log("tesing");
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = "flex";
    }
  }

 

}
