import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class CommonServiceProvider {

  common_url = ENV.config.COMMON_URL;
  api_url = ENV.config.API_URL;
  constructor(public http: Http) {}

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



}
