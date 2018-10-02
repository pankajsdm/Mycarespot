import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Content, Events } from "ionic-angular";
import { Config } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

let self;

@Component({
  selector: "page-conversation-detail",
  templateUrl: "conversation-detail.html"
})
export class ConversationDetailPage {
  @ViewChild(Content)
  content: Content;
  currentUser: any;
  channel: any;
  message = <any>{};
  messages = <any>[];
  audio = null;
  isLoading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    public events: Events
  ) {
    self = this;
    events.subscribe("message", doc => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log("Welcome", doc);
      if (self.channel._id == doc.channel) {
        self.messages.push(doc);
      }
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ConversationPage", Config);
    this.currentUser = JSON.parse(localStorage.getItem("user_data"));
    console.log(this.currentUser);
    let id = this.navParams.get("_id");

    this.http
      .post(Config.url + Config.api.messenger.detailChannel, {
        channel: id
      })
      .subscribe(data => {
        let channel = <any>data;
        this.channel = channel.data;
        console.log(this.channel);
        this.channel.userShow = {};
        for (let j = 0; j < this.channel.users.length; j++) {
          if (this.channel.users[j]._id != this.currentUser._id) {
            this.channel.userShow = this.channel.users[j];
          } else {
            this.channel.userShow.read = this.channel.users[j].read;
          }
        }

        self.http
          .post(Config.url + Config.api.messenger.readMessage, {
            channel: id,
            userId: self.currentUser._id
          })
          .subscribe(data => {});
      });

    this.http
      .get(Config.url + Config.api.messenger.message, {
        params: {
          channel: id
        }
      })
      .subscribe(data => {
        this.messages = data;
        this.isLoading = true;
        console.log(data);
      });
  }

  sendMessage() {
    console.log(self.message);
    if (!self.message.text) return;
    self._sendMessage();
  }

  _sendMessage() {
    let params = {
      from: {
        userId: self.currentUser._id,
        color: self.currentUser.color,
        name: self.currentUser.firstName + " " + self.currentUser.lastName,
        phone: self.currentUser.phone,
        avatar: self.currentUser.avatar || Config.avatar
      },
      channel: self.channel._id,
      createdAt: new Date(),
      text: null,
      image: null,
      video: null,
      file: null,
      fileType: null,
      audio: null,
      fileName: null
    };

    if (self.message.text) {
      params.text = self.message.text;
    }

    if (self.message.image) {
      params.image = self.message.image;
    }

    if (self.message.file) {
      params.file = self.message.file;
    }

    if (self.message.fileType) {
      params.fileType = self.message.fileType;
    }

    if (self.message.video) {
      params.video = self.message.video;
    }

    if (self.message.audio) {
      params.image = self.message.audio;
    }

    if (self.message.fileName) {
      params.fileName = self.message.fileName;
    }

    self.messages.push(params);
    let index = self.messages.length - 1;
    self.message = {};
    self.http
      .post(Config.url + Config.api.messenger.message, params)
      .subscribe(data => {
        self.messages[index]._id = data._id;
        console.log(data);
      });

    this.content.scrollToBottom();
  }

  ionViewWillEnter() {
    let tabs = document.querySelectorAll(".tabbar");
    if (tabs !== null) {
      Object.keys(tabs).map(key => {
        tabs[key].style.transform = "translateY(56px)";
      });
    } // end if
  }

  ionViewDidLeave() {
    let tabs = document.querySelectorAll(".tabbar");
    if (tabs !== null) {
      Object.keys(tabs).map(key => {
        tabs[key].style.transform = "translateY(0)";
      });
    } // end if
  }
}
