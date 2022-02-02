import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {ErrorEmail} from "../models/errorEmail";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private token?: string;
  private logIn: boolean = false;
  private userData?: { role: string; };

  constructor(private restService: RestService,
              private router: Router) {
  }

  public reloadTrigger$ = new BehaviorSubject<void>(undefined);

  public regUsers(user: User): Observable<ErrorEmail> {
    const newUser: FormData = new FormData();
    newUser.append("userName", user.userName);
    newUser.append("userSurname", user.userSurname);
    newUser.append("nickName", user.nickName);
    newUser.append("email", user.email);
    newUser.append("password", user.password);
    newUser.append("avatar", user.avatar, user.avatar.name);
    return this.restService.post<ErrorEmail>("/user/registration", newUser).pipe(
      tap(({message}) => {
        console.log("message", message);
        this.reloadTrigger$.next();
      }),
    );
  }

  checkEmail(email: User['email']): Observable<ErrorEmail> {
    const userInfo = Object.assign({}, {email});
    return this.restService.post<ErrorEmail>("/user/registration/checkEmail", userInfo);
  }

  changeEmail(userNewEmail: User['email']): Observable<ErrorEmail> {
    const oldEmail = this.getUserData()['email'];
    const newEmail = Object.assign({}, userNewEmail, {oldEmail});
    return this.restService.put<ErrorEmail>("/user/changeEmail", newEmail);
  }

  changePassword(userPassword: User): Observable<ErrorEmail> {
    const userId = this.getUserData()['id'];
    const userInfo = Object.assign({}, userPassword, {userId});
    return this.restService.put<ErrorEmail>("/user/changePassword", userInfo);
  }

  public authUsers(users: Pick<User, "email" | "password">): Observable<{ message: string, errEmail: boolean, userName: string }> {
    return this.restService.post<{ message: string, errEmail: boolean, userName: string }>("/user/authorization", users);
  }

  addInfoAboutUserToLocalStorage(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('avatar', data.avatar);
    const {role, email, userName, userSurname} = this.getUserData() as Record<string, string>;
    this.userData = {role};
    localStorage.setItem("userInfo", JSON.stringify({email, userName, userSurname}));
    this.isLogIn();
  }

  getUserData(): Record<string, string> {
    const data = localStorage.getItem('token') as string;
    return jwtDecode(data);
  }

  public getToken(): string | null {
    return localStorage.getItem("token");
  }

  isLogIn() {
    if (localStorage.getItem('token')) {
      return this.logIn = true;
    } else return this.logIn = false;
  }

  leaveAccount() {
    localStorage.setItem('token', '');
    localStorage.setItem('userInfo', '');
    localStorage.setItem('avatar', '');
    this.router.navigate(['']);
  }
}

