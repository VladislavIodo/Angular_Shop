import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ModalLoginComponent} from "../../../modal-windows/modal-login/modal-login.component";
import {MatDialog} from "@angular/material/dialog";
import {ReCaptchaService} from "../../../services/re-captcha.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less'],
  styles: [`
    input.ng-dirty.ng-invalid {
      border-color: #FF3F3F;
    }

    input.ng-dirty.ng-valid {
      border-color: #4BBC41;
    }
  `]
})
export class UserSettingsComponent implements OnInit {
  public userData = {
    email: ''
  };
  stateRecaptcha: boolean = false;
  public settingsEmailForm?: FormGroup;
  public settingsPasswordForm?: FormGroup;

  public get email() {
    return this.settingsEmailForm?.get("email");
  }

  public get oldPassword() {
    return this.settingsPasswordForm?.get("oldPassword");
  }

  public get newPassword() {
    return this.settingsPasswordForm?.get("newPassword");
  }

  public get repeatPassword() {
    return this.settingsPasswordForm?.get("repeatPassword");
  }

  constructor(private usersService: UsersService,
              private formBuilder: FormBuilder,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private reCaptchaService: ReCaptchaService) {
  }

  passwordRecaptchaGroup?: FormGroup;
  emailRecaptchaGroup?: FormGroup;
  siteKey!: string;
  resetRecaptcha: boolean = false;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$";

  ngOnInit(): void {
    const {email} = this.usersService.getUserData() as Record<string, string>;
    this.userData = {email};
    this.settingsEmailForm = new FormGroup({
      email: new FormControl("", [Validators.required,
        Validators.email, Validators.pattern(this.emailPattern)])
    });
    this.settingsPasswordForm = new FormGroup({
      oldPassword: new FormControl("", [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(21)]),
      newPassword: new FormControl("", [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(21)]),
      repeatPassword: new FormControl("", [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(21),
        RxwebValidators.compare({fieldName: "newPassword"})])
    });
    this.siteKey = "6LeU0_wdAAAAACb0m-ydfey9PoskkfHHsYTzxEbe";

    this.passwordRecaptchaGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
    this.emailRecaptchaGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  emailRecaptchaSuccess(captchaResponse: string) {
    this.reCaptchaService.captchaTokenValidate(captchaResponse).subscribe({
      next: (data) => {
        if (data.tokenValidate) {
          this.usersService.changeEmail(
            this.settingsEmailForm?.value
          ).subscribe({
            next: (data) => {
              if (!data.errorEmail) {
                this.usersService.leaveAccount();
                this.dialog.open(ModalLoginComponent, {
                  width: '500px'
                });
                this._snackBar.open("Ваш Email успешно обновлен, в целях безопасности выполните повторный вход!", "Закрыть", {
                  duration: 10000
                });
                this.stateRecaptcha = false;
                this.resetRecaptcha = true;
                this.settingsEmailForm?.reset();
              }
            },
            error: (error) => {
              if (error.status === 403) {
                this._snackBar.open("Данный Email адрес занят другим пользователем!", "Закрыть", {
                  duration: 5000
                });
                this.resetRecaptcha = true;
              } else {
                this._snackBar.open("Возникли непредвиденные неполадки, повторите попытку позже!", "Закрыть", {
                  duration: 5000
                });
              }
            }
          });
        }
      }
    });
  }

  passwordRecaptchaSuccess(captchaResponse: string) {
    this.reCaptchaService.captchaTokenValidate(captchaResponse).subscribe({
      next: (data) => {
        if (data.tokenValidate) {
          this.usersService.changePassword(
            this.settingsPasswordForm?.value
          ).subscribe({
            next: (data) => {
              if (!data.errorPassword) {
                this.usersService.leaveAccount();
                this.dialog.open(ModalLoginComponent, {
                  width: '500px'
                });
                this._snackBar.open("Ваш пароль успешно обновлен, в целях безопасности выполните повторный вход!", "Закрыть", {
                  duration: 10000
                });
                this.stateRecaptcha = false;
                this.resetRecaptcha = true;
                this.settingsEmailForm?.reset();
              }
            },
            error: (error) => {
              if (error.status === 403) {
                this._snackBar.open("Проверьте правильность ввода старого пароля и повторите попытку", "Закрыть", {
                  duration: 5000
                });
                this.resetRecaptcha = true;
              } else {
                this._snackBar.open("Возникли непредвиденные неполадки, повторите попытку позже!", "Закрыть", {
                  duration: 5000
                });
              }
            }
          });
        }
      }
    });
  }

  changeEmail() {
    this.stateRecaptcha = true;
  }

  changePassword() {
    this.stateRecaptcha = true;
  }
}
