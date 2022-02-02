import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {UsersService} from "./services/users.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userData: { role: string; } | undefined;
  constructor(private usersService: UsersService,
              private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin(route);
  }

  private checkUserLogin(route: ActivatedRouteSnapshot) {
    if (this.usersService.isLogIn()) {
      const {role} = this.usersService.getUserData() as Record<string, string>;
      this.userData = {role};
      const userRole = this.userData.role;
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
