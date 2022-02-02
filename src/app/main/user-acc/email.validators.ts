import { FormControl } from "@angular/forms";

export class emailValidator{

  static validEmails(control: FormControl): {[key:string]:boolean} | null{
    let tmp;
    if(control.value !== null){
      tmp = control.value.split('@');
    }
    if(Array.isArray(tmp) && ['mail.ru','gmail.com','yandex.ru','outlook.com','yahoo.com','aol.com'].includes(tmp[1])) {
      return null;
    }
    return {validEmails: true}
  }
}
