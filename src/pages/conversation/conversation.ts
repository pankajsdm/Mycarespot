import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "page-conversation",
  templateUrl: "conversation.html"
})
export class ConversationPage {
  currentUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ConversationPage", Config);
    this.currentUser = JSON.parse(localStorage.getItem("user_data"));

    this.http
      .get(Config.url + Config.api.messenger.channel, {
        params: {
          userId: this.currentUser._id
        }
      })
      .subscribe(data => {
        console.log("data", data);
      });
  }

  userProfile() {}
}
