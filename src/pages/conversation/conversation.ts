import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  currentUser: any;
  channels: any;

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
        this.channels = data;
        for (let i = 0; i < this.channels.length; i++) {
          this.channels[i].userShow = {};
          for (let j = 0; j < this.channels[i].users.length; j++) {
            if (this.channels[i].users[j]._id != this.currentUser._id) {
              this.channels[i].userShow = this.channels[i].users[j];
            } else {
              this.channels[i].userShow.read = this.channels[i].users[j].read;
            }
          }
        }
        console.log("data", this.channels);
      });
  }

  userProfile() {}

  openChat(item) {
    console.log(item);
  }
}
