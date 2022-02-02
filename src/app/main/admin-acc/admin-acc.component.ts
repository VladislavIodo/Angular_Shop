import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-admin-acc, ng-if-else',
  templateUrl: './admin-acc.component.html',
  styleUrls: ['./admin-acc.component.less']
})
export class AdminAccComponent implements OnInit {
  public adminButton = {
    titleAddOffer: 'Создать товар'
  };

  public userData = {
    email: '',
    userName: '',
    role: ''
  };

  constructor(private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    const {userName, role, email} = this.usersService.getUserData() as Record<string, any>;
    this.userData = {userName, role, email};
  }
}

