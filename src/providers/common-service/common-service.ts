import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from "../../app/app.config";
import { DoctorsPage } from "../../pages/doctors/doctors";

@Injectable()
export class CommonServiceProvider {

  common_url = Config.common_url;
  api_url = Config.api_url;
  action: Boolean = false;
  public loading: any;
  constructor(
    public http: Http, 
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
    ) {
    }

  fetch(url, dataObj) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.common_url+url, dataObj, {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  post(url, dataObj) {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        this.http.post(this.api_url+url, dataObj, {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  get(url) {
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        let token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        this.http.get(this.api_url+url, {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }
  
  delete(url) {
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        let token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        this.http.delete(this.api_url+url, {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  put(url, body: any) {
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        let token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        
        this.http.put(this.api_url+url, body, {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }



  cancle(){
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Te redirige en la pantalla del doctor.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.action = false;
          }
        }, 
        {
          text: 'Sí',
          handler: () => {
            this.action = true;
          }
        }
      ]
    });
    alert.present()
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Processing...',
        spinner: 'bubbles',
        cssClass: 'spinner-loading'
    });
    this.loading.present();
  }

  hideLoader() {
    this.loading.dismiss();
  }



}
