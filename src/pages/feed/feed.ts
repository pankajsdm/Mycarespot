import { LoginPage } from './../login/login';
import { AfterViewInit, Component, ElementRef} from '@angular/core';
import { Inject, ViewChild }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Content, NavParams, ToastController, NavController, MenuController, ActionSheetController, ModalController } from 'ionic-angular';
import { FeedCommentsPage } from "./feed-comments/feed-comments";
import { CommonServiceProvider } from '../../providers/common-service/common-service';

import { Config } from "../../app/app.config";
import { Observable } from 'rxjs';
import * as io from "socket.io-client";
let self;

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  @ViewChild(Content)
  content: Content;
  public commentForm: FormGroup;
  public childCommentForm: FormGroup;
  public cmt: {comments: any};

  online: Boolean = true;
  loading: any;
  feedsArr: any;
  socketFeedArr: any;
  feeds: any;
  current_page: any = 1;  
  deleteArr: any;
  current_user: any;
  current_lk_id: String;
  customComment: any;
  replyComment: any;
  replySubComment: any;
  isLoading: Boolean = false;
  backend_url = Config.backend_url;
  private socket;

  constructor(
    @Inject(DOCUMENT) document,
    private elementRef:ElementRef,
    public formdata: FormBuilder,
    public navCtrl: NavController,
    public authService: CommonServiceProvider,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public actionsheetCtrl: ActionSheetController
  ) {

    self = this;
    this.socket = io.connect(Config.home_url);
    this.detectNewFeedThroughSocket();
  }  

  detectNewFeedThroughSocket(){
    this.socket.on("feed:save", doc => {
      console.log("doc", doc);
      if (doc.feed_id) {

        if (!doc.Comments) doc.Comments = [];
        if (!doc.like) doc.like = [];
        if (!doc.media) doc.media = '';
        let newFeed = false;

        for (let i = 0; i < this.feeds.length; i++) {
          if (this.feeds[i]._id == doc._id) {
            let isCheckComment = false;
            
            for (let j = 0;j < this.feeds[i].Comments.length;j++) {
							if (this.feeds[i].Comments[j]._id == doc._id) {
								if (this.feeds[i].Comments[i].child_comment != doc.child_comment) {
									return;
								}
								this.feeds[i].Comments[j] = doc;
								isCheckComment = true;
								break;
							}
            }
            
            if (!isCheckComment) {
							this.feeds[i].Comments.push(doc);
						}

            break;
            
					}   
        } 
      }else{
        doc.created_by_user_id = [doc.created_by_user_id];
				if (!doc.Comments) doc.Comments = [];

				let isCheck = false;

				for (let i = 0; i < this.feeds.length; i++) {
					if (this.feeds[i]._id == doc._id) {
						this.feeds[i].message = doc.message;

						if (this.feeds[i].media) {
							this.feeds[i].media = doc.media;
						}
						isCheck = true;
						break;
					}
				}
				if (!isCheck) {
					this.feeds.unshift(doc);
				}
      }
    });
  }

  detectDeletionThroughSocket(){
    this.socket.on("feed:remove", doc => {
      this.getFeed();
    });
  }

  doInfinite(infiniteScroll) {
    //this.isLoading = true;
      setTimeout(() => {
      this.authService.get('feeds/getAllPosts?number_of_pages=10&current_page='+this.current_page).then((result) => {
        //this.isLoading = false;
        this.socketFeedArr  =  result;
        if(this.socketFeedArr.code=='401'){
          localStorage.clear();
          this.navCtrl.setRoot(LoginPage);
        }else{  
          for(var i=0; i < this.socketFeedArr.data.length; i++){

            if (!this.socketFeedArr.data[i].media) this.socketFeedArr.data[i].media = '';

            var json = {
              _id: this.socketFeedArr.data[i]._id,
              created_by_user_id: [{
                firstName: this.socketFeedArr.data[i].created_by_user_id[0].firstName,
                lastName: this.socketFeedArr.data[i].created_by_user_id[0].lastName,
                avatar: this.socketFeedArr.data[i].created_by_user_id[0].avatar
              }],
              message: this.socketFeedArr.data[i].message,
              media: this.socketFeedArr.data[i].media,
              createdAt: this.socketFeedArr.data[i].createdAt,
              like: this.socketFeedArr.data[i].like,
              Comments: this.socketFeedArr.data[i].Comments,
            }
            this.feeds.push(json);
          }

          console.log("new infinite", this.feeds);
          
          this.current_page = this.current_page + 1;
        }
      });
      infiniteScroll.complete();
    }, 500);
  } 

  /*ionViewDidLeave() {
    this.socket.unsubscribe();
  } */

  action(feed_id){
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Are you sure to delete?',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteFeed(feed_id)
          }
        }
      ]
    });
    actionSheet.present();
  }



  deleteFeed(feed_id){
    console.log("I am pushing...");
    var json = {
      _id: "5beab575b6b7d7a8b03a9854z",
      created_by_user_id: {
        firstName: "pankaj",
        lastName: "Pandey"
      },
      message: 'This is pankaj'
    }
    this.feeds.push(json)

    /* var elem = document.getElementById("card_"+feed_id);
    this.authService.showLoader('Deleting....');
    this.authService.delete('feeds/deletePostComment/'+feed_id).then((result) => {
      this.authService.hideLoader();
      this.deleteArr = result;
      if(this.deleteArr.code==200){
        elem.style.opacity = '0.2';
        elem.parentNode.removeChild(elem);
      }
    }); */
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad FeedPage');
   
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.getFeed();

    this.commentForm = this.formdata.group({
      comments: ['', [Validators.required]]
    });

    this.childCommentForm = this.formdata.group({
      child_comments: ['', [Validators.required]]
    });

  }

  ionViewWillEnter(){
    console.log("I am again here");
    setTimeout(() => {
      self.content.scrollToTop();
    }, 1000);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  getFeed(){
    if(this.online){
        this.isLoading = true;
        this.authService.get('feeds/getAllPosts?number_of_pages=10&current_page='+this.current_page).then((result) => {
          this.isLoading = false;
          this.feedsArr = result;
          
          if(this.feedsArr.code=='401'){
            localStorage.clear();
            this.navCtrl.setRoot(LoginPage);
          }else{  
            this.organizePost();
          }

        },(err) => {
          this.isLoading = false;
          this.presentToast('Something wrong! Please try later.');
        });
    }else{
      this.presentToast('Oh no! No internet found.');
    }
  }   


  organizePost(){
    for(var i=0; i < this.feedsArr.data.length; i++){

      if(this.checkAvailableID(this.feedsArr.data[i].like)){
        this.feedsArr.data[i]['me_like'] = true;
      }else{
        this.feedsArr.data[i]['me_like'] = false;
      } 

      for(var j=0; j < this.feedsArr.data[i].Comments.length; j++){
        if(this.checkAvailableID(this.feedsArr.data[i].Comments[j].like)){
          this.feedsArr.data[i].Comments[j]['me_like'] = true;
        }else{
          this.feedsArr.data[i].Comments[j]['me_like'] = false;
        }
      }
    }   
    this.feeds = this.feedsArr.data;
    this.current_page = this.current_page + 1;
    console.log("feeds", this.feeds);
  }     

  
  checkAvailableID(arr){
    for (var i=0; i < arr.length; i++){
      if(arr[i] == this.current_user._id){
          return true;
      }
    }
    return false;
  }
  
  userDetail(){
    console.log("I am clicked");
  }

  commentCreation(comment, index, comment_id){
    var cur_date = new Date();
    this.customComment = {
      child_comment: [],
      like: [],
      createdAt: cur_date,
      created_by_user_id:{
        avatar: this.current_user.avatar,
        firstName: this.current_user.firstName,
        lastName: this.current_user.lastName,
        _id: this.current_user._id
      },
      _id: comment_id,
      message: comment,
    }
    this.feeds[index].Comments.push(this.customComment);
  }

  postComment(id, index){
    console.log("commented...");
    this.current_page = 1;
    let comment = this.commentForm.get('comments').value;
    if(comment!=''){
      this.commentForm.reset()
      let body = {created_by_user_id: this.current_user._id, feed_id: id, message: comment};
      this.authService.post('feeds/addComments', body).then((result) => {
        console.log("comment", result);
        this.replyComment = result;
        this.commentCreation(comment, index, this.replyComment.data._id);
      },(err) => {  
        console.log("err", err);
      });
    }
  }

  replayComment(cmt_id){
    var x  = document.getElementById('child_comment_form_'+cmt_id);  
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  subCommentCreation(comment, index, cmt_index, comment_id){
    var cur_date = new Date();
    this.customComment = {
      child_comment: [],
      like: [],
      createdAt: cur_date,
      created_by_user_id:{
        avatar: this.current_user.avatar,
        firstName: this.current_user.firstName,
        lastName: this.current_user.lastName,
        _id: this.current_user._id
      },
      _id: comment_id,
      message: comment,
    }
    this.feeds[index].Comments[cmt_index].child_comment.push(this.customComment);
  }

  postSubComment(feed_id, index, cmt_index, cmt_id){
    let comment = this.childCommentForm.get('child_comments').value;
    console.log(index);
    console.log(cmt_index);
    console.log(cmt_id);
    if(comment!=''){
      this.childCommentForm.reset();
      let body = {created_by_user_id: this.current_user._id, message: comment};
      this.authService.put('feeds/addChildComments/'+cmt_id, body).then((result) => {
        console.log("comment", result);
        this.replySubComment = result;
        this.subCommentCreation(comment, index, cmt_index, this.replySubComment.data._id);
      },(err) => {  
        console.log("err", err);
      }); 
    }
  } 


  commentsFeed(feed_id){
    let profileModal = this.modalCtrl.create(FeedCommentsPage, { feed_id: feed_id });
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
    profileModal.present();
  }

  /* Counter for like and unlike */
  likeCounter(id, type){
    let selecter = document.querySelector("#total_like_"+id);
    let total;
    if(type=='like'){
      total = parseInt(selecter.textContent) + 1;
    }else{
      total = parseInt(selecter.textContent) - 1;
    }
    selecter.innerHTML = total;
  }

   /* Counter for like and unlike */
   likeCounterSubComment(id, type){
    let selecter = document.querySelector("#sub_comment_like_"+id);
    let total;
    let get_total;
    let get_number = parseInt(selecter.textContent);

    if(isNaN(get_number)){
      get_total = 0;
    }else{
      get_total = get_number;
    }

    if(type=='like'){
      total = get_total + 1;
    }else{
      total = get_total - 1;
    }
    selecter.innerHTML = total;
  }
  

  /* Bind like feed*/
  like_feed(id){
    console.log("I am like");
    this.likeCounter(id, 'like');
    let data = this.like_text(id);

    this.authService.put('feeds/addLikeToPost/'+id, {created_by_user_id: this.current_user._id}).then((result) => {
      console.log("like", result);
    },(err) => {
      console.log("err", err);
    });
  }

  /* Bind unlike feed*/
  unlike_feed(id){
    console.log("I am unlike");
    this.likeCounter(id, 'unlike');
    this.unlike_text(id);
    this.authService.put('feeds/unlikePost/'+id, {created_by_user_id: this.current_user._id}).then((result) => {
      console.log("unlike", result);
    },(err) => {
      console.log("err", err);
    });
  }

  /* Like feed by user first time */
  like(id){
    console.log("meliked", id);
    this.likeCounter(id, 'like');
    this.like_text(id);

    this.authService.put('feeds/addLikeToPost/'+id, {created_by_user_id: this.current_user._id}).then((result) => {
      console.log("like", result);
    },(err) => {
      console.log("err", err);
    });
  }

  
  /* Unlike feed by user first time */
  unlike(id){
    console.log("meunliked", id);
    this.likeCounter(id, 'unlike');
    this.unlike_text(id);

    this.authService.put('feeds/unlikePost/'+id, {created_by_user_id: this.current_user._id}).then((result) => {
        console.log("unlike", result);
    },(err) => {
      console.log("err", err);
    });
  } 

  /* Like text with event handler*/
  like_text(id){
    let data =  '<button _ngcontent-c0="" clear="" color="primary" icon-start="" ion-button="" small="" ng-reflect-color="primary" ng-reflect-small="" ng-reflect-clear="" class="button button-md button-clear button-clear-md button-small button-small-md button-clear-md-primary unlike_event_'+id+'"><span class="button-inner"><ion-icon _ngcontent-c0="" name="thumbs-up" role="img" class="icon icon-md ion-md-thumbs-up" aria-label="thumbs up" ng-reflect-name="thumbs-up"></ion-icon></span><div class="button-effect"></div></button>';
    document.getElementById('status_'+id).innerHTML = data;   
    let unlck =  this.elementRef.nativeElement.querySelector('.unlike_event_'+id);
    if(unlck){
      var feed_id = id;  
      unlck.addEventListener('click', () => {
        this.unlike_feed(feed_id);
      }, false);
     
    }
  }

  /* Unlike text with event handler*/
  unlike_text(id){
    let data =  '<button _ngcontent-c0="" clear="" color="primary" icon-start="" ion-button="" small="" ng-reflect-color="primary" ng-reflect-small="" ng-reflect-clear="" class="button button-md button-clear button-clear-md button-small button-small-md button-clear-md-primary like_event_'+id+'"><span class="button-inner"><ion-icon _ngcontent-c0="" name="ios-thumbs-up-outline" role="img" class="icon icon-md ion-ios-thumbs-up-outline" aria-label="thumbs up-outline" ng-reflect-name="ios-thumbs-up-outline"></ion-icon></span><div class="button-effect"></div></button>';
    document.getElementById('status_'+id).innerHTML = data; 
    let lck =  this.elementRef.nativeElement.querySelector('.like_event_'+id);
    if(lck){
      var feed_id = id;       
      lck.addEventListener('click', () => {
        this.like_feed(feed_id);
      }, false);

    }
  } 

  likeChild(comment_id){
    console.log("comment_id", comment_id);
    this.sub_like_text(comment_id);
    this.likeCounterSubComment(comment_id, 'like');
    this.authService.put('feeds/addLikeToComments/'+comment_id, {created_by_user_id: this.current_user._id}).then((result) => {
      console.log("like comment", result);
    },(err) => {
      console.log("err", err);
    });
  }

  unlikeChild(comment_id){
    console.log("comment_id", comment_id);
    this.sub_unlike_text(comment_id);
    this.likeCounterSubComment(comment_id, 'unlike');
    this.authService.put('feeds/unlikeComments/'+comment_id, {created_by_user_id: this.current_user._id}).then((result) => {
      console.log("unlike comment", result);
    },(err) => {
      console.log("err", err);
    });
  } 

  /* Sub like text with event handler*/
  sub_like_text(id){
    let data =  '<span class="comment_liked unlike_subcomment_'+id+'">Like</span>';
    document.getElementById('sub_comment_'+id).innerHTML = data;   
    let unlck =  this.elementRef.nativeElement.querySelector('.unlike_subcomment_'+id);
    if(unlck){
      var comment_id = id;  
      unlck.addEventListener('click', () => {
        this.unlikeChild(comment_id);
      }, false);

    }
  }

  /* Sub like text with event handler*/
  sub_unlike_text(id){
    let data =  '<span class="comment_unliked like_subcomment_'+id+'">Like</span>';
    document.getElementById('sub_comment_'+id).innerHTML = data;   
    let unlck =  this.elementRef.nativeElement.querySelector('.like_subcomment_'+id);
    if(unlck){
      var comment_id = id;  
      unlck.addEventListener('click', () => {
        this.likeChild(comment_id);
      }, false);
    }
  }
  
  /* Creating toast */
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  openMenu(){
    this.menu.open();
  }

}
