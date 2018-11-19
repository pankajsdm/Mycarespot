import { Component, ElementRef } from '@angular/core';
import { LoginPage } from './../../login/login';
import { Content, NavParams, ToastController, NavController, MenuController, ActionSheetController, ModalController, ViewController } from 'ionic-angular';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { Config } from "../../../app/app.config";

@Component({
  selector: 'page-feed-comments',
  templateUrl: 'feed-comments.html',
})
export class FeedCommentsPage {

  public commentForm: FormGroup;
  //public childCommentForm: FormGroup;
  
  online: Boolean = true;
  loading: any;
  feedsArr: any;
  socketFeedArr: any;
  feeds = {};   
  feed_id: String;
  customComment: any;
  replyComment: any;
  current_page: any = 1;  
  current_user: any;
  isLoading: Boolean = false;
  backend_url = Config.backend_url;
  
  constructor(
    private elementRef:ElementRef,
    public formdata: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: CommonServiceProvider,
  ) {
    this.commentForm = this.formdata.group({
      comments: ['', [Validators.required]]
    }); 
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedCommentsPage');
    this.feed_id =  this.navParams.get('feed_id');
    this.getFeed(this.feed_id);

    

    /* this.childCommentForm = this.formdata.group({
      child_comments: ['', [Validators.required]]
    }); */

  }

  getFeed(feed_id){
    if(this.online){
        this.isLoading = true;
        this.authService.get('feeds/getPostById/'+feed_id).then((result) => {
          this.feedsArr = result;
          if(this.feedsArr.code=='401'){
            localStorage.clear();
            this.navCtrl.setRoot(LoginPage);
          }else{  
            this.feeds = this.feedsArr.data;
            this.isLoading = false;
          }
        },(err) => {
          this.isLoading = false;
          this.authService.presentToast('Something wrong! Please try later.', 'bottom');
        });
    }
  }  

  organizePost(){
    

    /*   if(this.checkAvailableID(this.feedsArr.data.like)){
        this.feedsArr.data['me_like'] = true;
      }else{
        this.feedsArr.data['me_like'] = false;
      }  */

      this.feeds = this.feedsArr.data;
      console.log("feeds", this.feeds);
      

      /* for(var j=0; j < this.feedsArr.data[i].Comments.length; j++){
        if(this.checkAvailableID(this.feedsArr.data[i].Comments[j].like)){
          this.feedsArr.data[i].Comments[j]['me_like'] = true;
        }else{
          this.feedsArr.data[i].Comments[j]['me_like'] = false;
        }
      } */
    
    //
    //this.current_page = this.current_page + 1;
    //console.log("feeds", this.feeds);
  }
  
  checkAvailableID(arr){
    for (var i=0; i < arr.length; i++){
      if(arr[i] == this.current_user._id){
          return true;
      }
    }
    return false;
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


  commentCreation(comment, comment_id){
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
    this.feedsArr.data.Comments.push(this.customComment);
  }

  postComment(id){
    console.log("commented...");
    this.current_page = 1;
    let comment = this.commentForm.get('comments').value;
    if(comment!=''){
      this.commentForm.reset()
      let body = {created_by_user_id: this.current_user._id, feed_id: id, message: comment};
      this.authService.post('feeds/addComments', body).then((result) => {
        console.log("comment", result);
        this.replyComment = result;
        //this.commentCreation(comment, this.replyComment.data._id);
      },(err) => {  
        console.log("err", err);
      });
    }
  }


  

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
