import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-vitals-chooser',
  templateUrl: 'vitals-chooser.html',
})
export class VitalsChooserPage {

  weights: any;
  heights = [ 
    '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0',
    '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '3.0',
    '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '4.0',
    '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '5.0',
    '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '6.0',
    '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '7.0',
    '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '8.0'
    ];
  
  
  systolicArr = ['70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
  diastolicArr = ['40', '50', '60', '70', '80', '90', '100'];
  tempratureArr = [95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
  breathsArr = ['10-30', '12-28', '12-18', '17–23', '18–25', '20–30', '25–40', '30–60'];
  pulseArr = ['62-64', '64-68', '68-70', '70-72', '72-74', '75-76', '78-80'];
  months: any = [];
  years: any  = [];
  type: String;
  title: String;
  
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {

      this.weights = Array(500).fill(1).map((x,i)=>i+1);

      for (let i = 1; i < 32; i++) {
        this.months.push(i);
      }
       
      for (let j = 2019; j < 2031; j++) {
        this.years.push(j);
      }
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitalsChooserPage');
    this.type =  this.navParams.get('value');

    if(this.type=='weight'){
      this.title = 'Libras';
    }else if(this.type=='height'){
      this.title = 'Altura';
    }else if(this.type=='systolic'){
      this.title = 'Sistólica';
    }else if(this.type=='diastolic'){
      this.title = 'Diastólica';
    }else if(this.type=='temprature'){
      this.title = 'Temperatura';
    }else if(this.type=='pulse'){
      this.title = 'Pulsos por min';
    }else if(this.type=='months'){
      this.title = 'Meses';
    }else if(this.type=='years'){
      this.title = 'Años';
    }else{
      this.title = 'respiración';
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  choose(code){
    let data = { 'code': code };
    this.viewCtrl.dismiss(data);
  }

}
