import {Component, OnInit} from '@angular/core';
import {CartService} from "../services/cart.service";
import {ModalRegistrationComponent} from '../modal-windows/modal-registration/modal-registration.component';
import {FavoritesService} from "../services/favorites.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalLoginComponent} from "../modal-windows/modal-login/modal-login.component";
import {UsersService} from "../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  private userData: { role: string; } | undefined;

  constructor(private cartService: CartService,
              public dialog: MatDialog,
              private usersService: UsersService,
              private favoriteService: FavoritesService,
              private router: Router) {
  }

  logoNameItem = 'Carpenter';

  public numberGoods: number = 0;
  public numberFavorites: number = 0;
  avatar: string | null = '';
  logIn: boolean = false;

  ngOnInit(): void {
    this.cartService.numberGoods().subscribe(() => {
      const numberGoods: number[] = JSON.parse(<string>localStorage.getItem('offer'));
      if (numberGoods !== null) {
        this.numberGoods = numberGoods.length;
      }
    });
    this.favoriteService.numberFavorites().subscribe(() => {
      const numberFavorites: number[] = JSON.parse(<string>localStorage.getItem('favorites'));
      if (numberFavorites !== null) {
        this.numberFavorites = numberFavorites.length;
      }
    });
  }

  openDialogReg() {
    this.dialog.open(ModalRegistrationComponent, {
      width: '500px'
    });
  }

  openDialogLogIn() {
    this.dialog.open(ModalLoginComponent, {
      width: '500px'
    });
  }


  isLogIn() {
    this.avatar = localStorage.getItem('avatar');
    this.logIn = this.usersService.isLogIn();
    return this.logIn;
  }

  openAccount() {
    const {role} = this.usersService.getUserData() as Record<string, string>;
    this.userData = {role};
    if (this.userData.role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (this.userData.role === 'user') {
      this.router.navigate(['/user']);
    }
  }

  leaveAccount() {
    this.usersService.leaveAccount();
  }
}
