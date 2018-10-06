import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-body-measurement-chooser',
  templateUrl: 'body-measurement-chooser.html',
})
export class BodyMeasurementChooserPage {

  heights = [ '5.2', '5.4', '5.6', '5.8', '6.0', '6.1', '6.2', '6.3', '6.4', '6.5'];
  weights = [ '55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'];
  type: String;
  title: String;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BodyMeasurementChooserPage');
    this.type =  this.navParams.get('value');
    if(this.type=='height'){
      this.title = 'Altura';
    }else{
      this.title = 'Peso';
    }
  }

  choose(code){
    let data = { 'code': code };
    this.viewCtrl.dismiss(data);
  }

}
