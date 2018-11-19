import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { RegisterOptionsPage } from '../register-options/register-options';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,  public events: Events,) {
    this.check_auth();
  }

  goToRegister() { 
    this.navCtrl.push(RegisterOptionsPage);
  }
  
  goToLogin() { 
    this.navCtrl.push(LoginPage); 
  }

  /* Check for already exist sessional data */
  check_auth(){
    if(localStorage.getItem('user_data')) {
      let userdata = JSON.parse(localStorage.getItem('user_data'));
      this.publish_events(userdata);
      this.navCtrl.setRoot(TabsPage);
    }
  } 

  /* Pubslish event on each update */
   publish_events(data){
    this.events.publish(
      'user:update', 
      data,
    );
  }

}
