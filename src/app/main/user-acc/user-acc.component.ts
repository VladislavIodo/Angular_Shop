import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-user-acc',
  templateUrl: './user-acc.component.html',
  styleUrls: ['./user-acc.component.less']
})
export class UserAccComponent implements OnInit {
  public userButton = {
    orderButton: "Мои заказы",
    settingsButton: "Настройки",
    logoutButton: "Выйти",
  };

  public userData = {
    email: '',
    userName: ''
  };

  avatar: string | null = "";

  constructor(private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.avatar = localStorage.getItem("avatar");
    const {userName, email} = this.usersService.getUserData() as Record<string, string>;
    this.userData = {userName, email};
  }

  leaveAccount() {
    this.usersService.leaveAccount();
  }
}
