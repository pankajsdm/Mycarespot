
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { TabsPage } from './../tabs/tabs';

@Component({
  selector: 'page-adjustments',
  templateUrl: 'adjustments.html',
})
export class AdjustmentsPage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdjustmentsPage');
  }

  openMenu(){
    this.menu.open();
  }

  home(){
    this.navCtrl.setRoot(TabsPage);
  }

}
