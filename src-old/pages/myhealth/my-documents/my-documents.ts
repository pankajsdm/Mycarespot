
import { Component } from '@angular/core';
import { Events, ModalController, LoadingController, NavParams, NavController, MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { MyDocumentDetailsPage } from './my-document-details/my-document-details';
import { Config } from "../../../app/app.config";
import { HttpClient } from "@angular/common/http";

let self;

@Component({
  selector: 'page-my-documents',
  templateUrl: 'my-documents.html',
})
export class MyDocumentsPage {

  online: Boolean = true;
  loading: any;   
  rawMat: any;   
  lists: any;   
  currentUser: any;
  nodata_found = '';
  isLoading = true;

  constructor(
    public loadingCtrl: LoadingController,
    private event: Events,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) {
    self = this;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDocumentsPage');
    this.currentUser = JSON.parse(localStorage.getItem('user_data'));
    this.getDocument(this.currentUser.patientId);
    this.event.subscribe('isDeleted', (paramsVar) => {
      if(paramsVar){
        this.getDocument(this.currentUser.patientId);
      }
    });
  }
  
  getDocument(_id) {
    if (this.online) {
      
      this.authService.get('patient/getUploadDocument/' + _id).then(result => {
        this.isLoading = false;
        this.rawMat = result;
        this.lists = this.rawMat.data;
        if(this.lists.length==0){
          this.nodata_found = 'No tiene farmacias.';
        }
      },(err) =>{
        this.nodata_found = 'Something wrong...';
      });
    }
  }

  uploadImage(event) {
    let file = event.srcElement.files[0];
    if (!file) return;
    let formData: FormData = new FormData();
    formData.append("file", file);
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let loading = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loading.present();
    let url = Config.url+'/api/patient/uploadPatientMedicalRecords/'+this.currentUser.patientId;
    self.http.put(url, formData).subscribe(res => {
      loading.dismiss();
      console.log("res.code", res.code);
      if(res.code==200){
        this.event.publish('isDeleted', true);
      }
    },(err) => {
        loading.dismiss();
    });

  }

  details(id, url){
    this.navCtrl.push(MyDocumentDetailsPage, {id: id, url: url});
  } 


  docProfile(){
    
  }

}
