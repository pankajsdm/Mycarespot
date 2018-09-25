import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-vitals-chooser',
  templateUrl: 'vitals-chooser.html',
})
export class VitalsChooserPage {

  systolicArr = ['70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
  diastolicArr = ['40', '50', '60', '70', '80', '90', '100'];
  tempratureArr = [95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
  breathsArr = ['10-30', '12-28', '12-18', '17–23', '18–25', '20–30', '25–40', '30–60'];
  type: String;
  title: String;
  
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsChooserPage');
    this.type =  this.navParams.get('value');
    if(this.type=='systolic'){
      this.title = 'Sistólica';
    }else if(this.type=='diastolic'){
      this.title = 'Diastólica';
    }else if(this.type=='temprature'){
      this.title = 'Temperatura';
    }else{
      this.title = 'respiración';
    }
  }

  choose(code){
    let data = { 'code': code };
    this.viewCtrl.dismiss(data);
  }

}
