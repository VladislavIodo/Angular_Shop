import {Component, Input, OnInit} from "@angular/core";
import {AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {User} from "../../models/user";
import {UsersService} from "../../services/users.service";
import {ModalLoginComponent} from "../modal-login/modal-login.component";
import {Observable, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ErrorEmail} from "../../models/errorEmail";
import {emailValidator} from '../../main/user-acc/email.validators';


@Component({
  selector: "app-modal-registration",
  templateUrl: "./modal-registration.component.html",
  styleUrls: ["./modal-registration.component.less"],
  styles: [`
    input.ng-dirty.ng-invalid {
      border-color: #FF3F3F;
    }

    input.ng-dirty.ng-valid {
      border-color: #4BBC41;
    }
  `]
})
export class ModalRegistrationComponent implements OnInit {
  title = "Создать";
  @Input() users!: User;
  public registrationForm?: FormGroup;
  public showImage: string | undefined;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  public get userName() {
    return this.registrationForm?.get("userName");
  }

  public get userSurname() {
    return this.registrationForm?.get("userSurname");
  }

  public get nickName() {
    return this.registrationForm?.get("nickName");
  }

  public get avatar() {
    return this.registrationForm?.get("avatar");
  }

  public get email() {
    return this.registrationForm?.get("email");
  }

  public get password() {
    return this.registrationForm?.get("password");
  }

  public get repeatPassword() {
    return this.registrationForm?.get("repeatPassword");
  }

  registrationUser() {
    this.usersService.regUsers(
      this.registrationForm?.value
    ).subscribe({
      next: (data) => {
        if (!data.errorEmail) {
          this.dialog.closeAll();
          this.usersService.addInfoAboutUserToLocalStorage(data);
          this.router.navigate(["/store"]);
          this._snackBar.open("Вы успешно зарегистрированы, данные учетной записи отправлены на ваш email (P.S. купи диван)", "Закрыть", {
            duration: 5000
          });

        }
        return false;
      },
      error: (error) => {
        if (error.status === 403) {
          this._snackBar.open("Данный Email адрес занят другим пользователем! Повторите регистрацию с другим Email адресом! (P.S. купи диван)", "Закрыть", {
            duration: 5000
          });
        } else {
          this._snackBar.open("Возникли непредвиденные неполадки, повторите попытку позже!", "Закрыть", {
            duration: 5000
          });
        }
      }
    });
  }

  openLogIn() {
    this.dialog.closeAll();
    this.dialog.open(ModalLoginComponent, {
      width: '500px'
    });
  }

  public addImage(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.length && files[0];
    this.registrationForm?.patchValue({avatar: file});
    this.registrationForm?.get("avatar")?.updateValueAndValidity();
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.showImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      userSurname: new FormControl("", Validators.required),
      nickName: new FormControl("", Validators.required),
      avatar: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required,
        Validators.email, emailValidator.validEmails], [this.userEmailValidator()]),
      password: new FormControl("", [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(21)]),
      repeatPassword: new FormControl("", [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(21),
        RxwebValidators.compare({fieldName: "password"})])
    });
  }

  userEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(1500).pipe(
        switchMap(() => this.usersService.checkEmail(control.value)),
        map((data: ErrorEmail) => {
          if (data.errorEmail) {
            return {'userEmailValidator': true};
          } else return null;
        })
      );
    };
  }
}
