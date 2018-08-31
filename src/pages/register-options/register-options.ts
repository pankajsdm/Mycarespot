import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginPage } from '../login/login';
import { RegisterAccountPage } from '../register-account/register-account'

@Component({
  selector: 'page-register-options',
  templateUrl: 'register-options.html',
})
export class RegisterOptionsPage {

  private fb: any;
  isLoggedIn:boolean = false;
  
  constructor(
    fb: Facebook,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.fb = fb; 
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOptionsPage');
  }

  
  facebook(){
    console.log("I am facebook login");
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      console.log("status", res.status);
      console.log("status", res.authResponse.accessToken);
      console.log("status", res.authResponse.userID);

      if (res.status == 'connected') {
        this.fb.api("/me/?fields=id,email,last_name,first_name", ["public_profile", "email"]).then(
          fbUser => {
            this.connectDb(res.authResponse.accessToken, fbUser.id, fbUser.first_name, fbUser.last_name, fbUser.email);
          },  
          error => {
            console.log('error1', error);
          }
        ) 
      }
    })  
    .catch(e => console.log('Error logging into Facebook', e));
  } 

  connectDb(token, id, first_name, last_name, email){
    console.log(token);
    console.log(id);
    console.log(first_name);
    console.log(last_name);
    console.log(email);
  }

  goToLogin(){
    this.navCtrl.push(LoginPage); 
  }     

  register(type) { 
    this.navCtrl.push(RegisterAccountPage, {type: type});
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }
    

  attached(p){}

}
