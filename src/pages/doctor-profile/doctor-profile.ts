import { Component } from "@angular/core";
import {ToastController,NavController,MenuController,NavParams} from "ionic-angular";
import { PatientInfoPage } from "./../patient-info/patient-info";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { HttpClient } from "@angular/common/http";
import { Config } from "../../app/app.config";
import { ConversationDetailPage } from "../conversation-detail/conversation-detail";

@Component({
  selector: "page-doctor-profile",
  templateUrl: "doctor-profile.html"
})
export class DoctorProfilePage {
  online: Boolean = true;
  loading: any;
  doctrArr: any;
  doctor: any = { firstName: "", lastName: "" };
  doc_id: string;
  tabBarElement: any;
  currentUser: any;
  isLoading: Boolean = false;
  basicInfo: any = {};
  backgroundInfo : any = {};
  constructor(
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public navParams: NavParams,
    private http: HttpClient
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad DoctorProfilePage");
    this.doc_id = this.navParams.get("_id");
    this.getDoctor(this.doc_id);
    this.currentUser = JSON.parse(localStorage.getItem("user_data"));
  }

  getDoctor(_id) {
    if (this.online) {
      this.isLoading = true;
      this.authService
        .get("practioner/getPractionerProfileInformation/" + _id)
        .then(
          result => {
            this.isLoading = false;
            this.doctrArr = result;
            this.doctor = this.doctrArr.data[0];
            this.basicInfo = this.doctor.basic_information;
            if(this.doctor.background_information){
              this.backgroundInfo = this.doctor.background_information;
            }            
            console.log("doct", this.doctrArr.data[0]);
          },
          err => {
            this.isLoading = false;
            this.presentToast("Something wrong! Please try later.");
          }
        );
    } else {
      this.presentToast("Oh no! No internet found.");
    }
  }

  patientInfo() {
    this.navCtrl.push(PatientInfoPage);
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

  openMenu() {
    this.menu.open();
  }

  ionViewDidEnter() {
    console.log("tesing");
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = "flex";
    }
  }

  openChat() {
    console.log(this.doctor, this.currentUser);

    let channel = {
      users: [
        {
          user: this.currentUser._id,
          read: 0,
          name: this.currentUser.firstName + " " + this.currentUser.lastName,
          avatar: this.currentUser.avatar
        },
        {
          user: this.doctor._id,
          read: 0,
          name: this.doctor.firstName + " " + this.doctor.lastName,
          avatar: this.doctor.avatar
        }
      ],
      from: this.currentUser._id,
      to: this.doctor._id
    };

    this.http
      .post(Config.url + Config.api.messenger.channel, channel)
      .subscribe(data => {
        let channel = <any>data;
        console.log(data);
        this.navCtrl.push(ConversationDetailPage, {
          _id: channel.data._id
        });
      });
  }

  getLanguages(){
    if(this.basicInfo && this.basicInfo.languages){
      let lng = this.basicInfo.languages;
      return lng.slice(0, lng.length)
    } else {
      return ''
    }    
  }
}
