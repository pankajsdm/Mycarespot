import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "page-conversation-detail",
  templateUrl: "conversation-detail.html"
})
export class ConversationDetailPage {
  currentUser: any;
  channel: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ConversationDetailPage", Config);
    this.currentUser = JSON.parse(localStorage.getItem("user_data"));
  }
}
