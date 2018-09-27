import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-vitals-chooser',
  templateUrl: 'vitals-chooser.html',
})
export class VitalsChooserPage {

  heights = [ '5.2', '5.4', '5.6', '5.8', '6.0', '6.1', '6.2', '6.3', '6.4', '6.5'];
  weights = [ '55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'];
  
  systolicArr = ['70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
  diastolicArr = ['40', '50', '60', '70', '80', '90', '100'];
  tempratureArr = [95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
  breathsArr = ['10-30', '12-28', '12-18', '17–23', '18–25', '20–30', '25–40', '30–60'];
  pulseArr = ['62-64', '64-68', '68-70', '70-72', '72-74', '75-76', '78-80'];
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
    if(this.type=='weight'){
      this.title = 'Libras';
    }else if(this.type=='height'){
      this.title = 'Sistólica';
    }else if(this.type=='systolic'){
      this.title = 'Sistólica';
    }else if(this.type=='diastolic'){
      this.title = 'Diastólica';
    }else if(this.type=='temprature'){
      this.title = 'Temperatura';
    }else if(this.type=='pulse'){
      this.title = 'Pulsos por min';
    }else{
      this.title = 'respiración';
    }
  }

  choose(code){
    let data = { 'code': code };
    this.viewCtrl.dismiss(data);
  }

}
