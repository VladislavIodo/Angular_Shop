import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {UsersService} from "../../services/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {emailValidator} from '../../main/user-acc/email.validators';


@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.less'],
  styles: [`
    input.ng-dirty.ng-invalid {
      border-color: #FF3F3F;
    }

    input.ng-dirty.ng-valid {
      border-color: #4BBC41;
    }
  `]
})
export class ModalLoginComponent implements OnInit {
  title = 'Войти';
  @Input() users!: User;
  public logInForm?: FormGroup;

  constructor(
    private usersService: UsersService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  public get email() {
    return this.logInForm?.get("email")
  }

  public get password() {
    return this.logInForm?.get("password")
  }

  emailValidator(nameValidator: FormControl): { [s: string]: boolean } | null {
    if (nameValidator.value === "test") {
      return {"emailValidator": true};
    }
    return null;
  }

  authUser() {
    this.usersService.authUsers(this.logInForm?.value).subscribe(data => {
        if (data.userName) {
          this.dialog.closeAll();
          this._snackBar.open(`${data.userName} вы вошли в аккаун (P.S. спеши за покупками)`, 'Закрыть', {
            duration: 5000
          });
          this.usersService.addInfoAboutUserToLocalStorage(data);
        }
      }, () => {
        this._snackBar.open('Вы не зарегестрированы:( (скорее регистрируйся)', 'Закрыть', {
          duration: 5000
        });
      }
    )
    this.logInForm?.reset();
    return false;
  }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email, emailValidator.validEmails]),
      password: new FormControl("", [Validators.required,
        Validators.minLength(7)])
    })
  }
}

