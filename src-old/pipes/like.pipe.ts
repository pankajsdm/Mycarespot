import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';  

@Pipe({
  name: 'like'
})
export class LikePipe implements PipeTransform {

    user_data: any;
    constructor(private _sanitizer: DomSanitizer) {
        this.user_data = JSON.parse(localStorage.getItem('user_data'));
    }  
  
    /*transform(value: any, args?: any): any {
        return value.replace(/_/g, " ");
    } */

    transform(value: string, feed_id?: string): SafeHtml {  
        
        console.log("user_data_cons", feed_id);
        console.log("value is", value);
        let termsApply = '';        
        if(this.checkAvailableID(value, this.user_data._id)){
            termsApply =   '<button onclick="like()" id="like_{{feed._id}}" ion-button color="primary" clear small icon-start (click)="like(feed._id)"><ion-icon name="thumbs-up"></ion-icon></button>';
        }else{  
            termsApply =   '<button style="display:none" onclick="unlike('+feed_id+')" id="unlike_'+feed_id+'" _ngcontent-c0="" clear="" color="primary" icon-start="" ion-button="" small="" ng-reflect-color="primary" ng-reflect-small="" ng-reflect-clear="" class="button button-md button-clear button-clear-md button-small button-small-md button-clear-md-primary" id="unlike_5b233ec8087a2969b2ded074"><span class="button-inner"><ion-icon _ngcontent-c0="" name="ios-thumbs-up-outline" role="img" class="icon icon-md ion-ios-thumbs-up-outline" aria-label="thumbs up-outline" ng-reflect-name="ios-thumbs-up-outline"></ion-icon></span><div class="button-effect"></div></button>';
        }
    
        return this._sanitizer.bypassSecurityTrustHtml(termsApply);
    }  

    checkAvailableID(arr, id){
        for (var i=0; i < arr.length; i++){
            if(arr[i] == id){
                return true;
            }
        }
        return false;
    }

  

}

