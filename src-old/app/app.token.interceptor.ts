import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (window.localStorage.getItem("token")) {
      let token = window.localStorage.getItem("token");
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    } else {
      request = request.clone();
    }

    return next
      .handle(request)
      .do((event: HttpEvent<any>) => {}, (err: any) => {});
  }
}
