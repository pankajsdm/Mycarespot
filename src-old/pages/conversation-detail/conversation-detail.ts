import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  Content,
  Events,
  LoadingController
} from "ionic-angular";
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
    public events: Events,
    public loadingCtrl: LoadingController
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

        if (!this.channel.userShow.name) {
          this.channel.userShow.name =
            this.channel.userShow.firstName +
            " " +
            this.channel.userShow.lastName;
        }

        this.channel.userShow._id = this.channel.userShow.user._id;
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
        setTimeout(() => {
          self.content.scrollToBottom();
        }, 1000);
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

  uploadImage(event) {
    let file = event.srcElement.files[0];
    if (!file) return;
    let formData: FormData = new FormData();
    if (file.type.indexOf("image") != -1) {
      self.message.fileType = "image";
    } else if (file.type.indexOf("video") != -1) {
      self.message.fileType = "video";
    } else if (file.type.indexOf("audio") != -1) {
      self.message.fileType = "audio";
    } else {
      self.message.fileType = "file";
    }
    self.message.fileName = file.name;

    let url = Config.url + Config.api.messenger.uploadImage;
    formData.append("file", file);
    formData.append("user_id", self.currentUser._id);
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let loading = this.loadingCtrl.create({
      content: "Uploading..."
    });

    loading.present();
    self.http.post(url, formData).subscribe(
      response => {
        if (self.message.fileType == "image") {
          self.message.image = response.data.imageUrl;
        } else if (self.message.fileType == "video") {
          self.message.video = response.data.imageUrl;
        } else if (self.message.fileType == "audio") {
          self.message.audio = response.data.imageUrl;
        } else {
          self.message.file = response.data.imageUrl;
        }
        self._sendMessage();
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  openCall(option) {
    if (!this.channel.userShow || !this.channel.userShow._id) {
      return;
    }
    let params: any = {
      option: option,
      receive: {
        _id: this.channel.userShow._id,
        name: this.channel.userShow.name,
        avatar: this.channel.userShow.avatar
      }
    };

    self.events.publish("webrtc", params);
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
