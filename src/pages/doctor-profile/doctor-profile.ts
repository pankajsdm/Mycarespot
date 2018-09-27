import { Component } from "@angular/core";
import {
  ToastController,
  LoadingController,
  NavController,
  MenuController,
  NavParams
} from "ionic-angular";
import { PatientInfoPage } from "./../patient-info/patient-info";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

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
  currentUser: any;

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public navParams: NavParams,
    private http: HttpClient
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad DoctorProfilePage");
    this.currentUser = JSON.parse(localStorage.getItem("user_data"));

    this.doc_id = this.navParams.get("_id");
    this.getDoctor(this.doc_id);
  }

  getDoctor(_id) {
    if (this.online) {
      this.showLoader();
      this.authService
        .get("practioner/getPractionerProfileInformation/" + _id)
        .then(
          result => {
            this.loading.dismiss();
            this.doctrArr = result;
            this.doctor = this.doctrArr.data[0];
            console.log("doct", this.doctrArr.data[0]);
          },
          err => {
            this.loading.dismiss();
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

  /* Show prgoress loader*/
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
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
          name: this.doctor.firstName + " " + this.currentUser.lastName,
          avatar: this.doctor.avatar
        }
      ],
      from: this.currentUser._id,
      to: this.doctor._id
    };

    this.http
      .post(Config.url + Config.api.messenger.channel, channel)
      .subscribe(data => {
        console.log(data);
      });
  }
}
