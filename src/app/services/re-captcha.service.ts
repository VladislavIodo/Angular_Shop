import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReCaptchaService {

  constructor(private restService: RestService) {
  }

  captchaTokenValidate(captchaResponse: string): Observable<{ message: string, tokenValidate: boolean }> {
    return this.restService.post<{ message: string, tokenValidate: boolean }>("/user/captcha", {captchaResponse});
  }
}
