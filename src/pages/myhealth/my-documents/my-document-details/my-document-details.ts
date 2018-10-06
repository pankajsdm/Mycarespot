import { Component } from '@angular/core';
import { Events, NavController, LoadingController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../../providers/common-service/common-service';


@Component({
  selector: 'page-my-document-details',
  templateUrl: 'my-document-details.html',
})
export class MyDocumentDetailsPage {

  url: String;
  _id: any;
  loading: any;     
  lists: any;   
  isLoading: boolean = false;
  

  constructor(
    
    private event: Events,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDocumentDetailsPage');
    this.url = this.navParams.get('url');
    this._id = this.navParams.get('id');
    console.log("id", this._id);
  }

  deletePic(){
    this.showLoader();
    this.authService.delete('patient/deletePatientUploadedMedicalDocument/' + this._id).then(result => {
      this.loading.dismiss();
      this.lists = result;
      if(this.lists.code==200){
        this.presentToast('Document deleted successfully...');
        setTimeout(() => {
          this.navCtrl.pop().then( () => {
            this.event.publish('isDeleted', true);
          });
        }, 1000);
      }
    },(err) =>{
      this.loading.dismiss();
      this.presentToast('Something wrong!');
    });
  }


  confirmDelete() {
    const confirm = this.alertCtrl.create({
      title: '¿Estás seguro de eliminar?',
      message: '¿Realmente quieres borrar? Pero por favor asegúrese de que el documento eliminado no se pueda deshacer',
      buttons: [
        {
          text: 'Discrepar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'De acuerdo',
          handler: () => {
           this.deletePic()
          }
        }
      ]
    });
    confirm.present();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Deleting...'
    });
    this.loading.present();
  }


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
