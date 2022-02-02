import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from "../services/users.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public userService: UsersService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userService.getToken()}`
      }
    });

    return next.handle(request);
  }
}
