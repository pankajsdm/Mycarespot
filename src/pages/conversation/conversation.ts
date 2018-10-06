import { Component } from "@angular/core";
import { NavController, NavParams, FabList, Events } from "ionic-angular";
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ConversationDetailPage } from "./../conversation-detail/conversation-detail";

let self;

@Component({
  selector: "page-conversation",
  templateUrl: "conversation.html"
})
export class ConversationPage {
  currentUser: any;
  channels: any;
  isLoading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    public events: Events
  ) {
    self = this;
    events.subscribe("channel", data => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      self.channels = data;
    });
  }

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
        self.channels = data;
        let read = 0;
        for (let i = 0; i < self.channels.length; i++) {
          self.channels[i].userShow = {};
          for (let j = 0; j < self.channels[i].users.length; j++) {
            if (self.channels[i].users[j]._id != this.currentUser._id) {
              self.channels[i].userShow = self.channels[i].users[j];
            } else {
              read = self.channels[i].users[j].read;
            }
          }
          self.channels[i].userShow.read = read;
        }

        self.isLoading = true;

        console.log("data", self.channels);
      });
  }

  userProfile() {}

  openChat(item) {
    console.log(item);
    this.navCtrl.push(ConversationDetailPage, {
      _id: item._id
    });
  }
}
