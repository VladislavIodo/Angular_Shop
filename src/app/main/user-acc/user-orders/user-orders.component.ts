import {Component, OnInit} from '@angular/core';
import {Order} from "../../../models/Order";
import {Observable} from "rxjs";
import {OffersService} from "../../../services/offers.service";
import {tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  ModalUserOrderTableComponent
} from "../../../modal-windows/modal-user-order-table/modal-user-order-table.component";
import {OrderService} from "../../../services/order.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UsersService} from "../../../services/users.service";

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserOrdersComponent implements OnInit {

  orders: Observable<Order[]> | undefined;
  displayedColumns: string[] = ['date', 'status', 'total-price', 'details'];
  dataSource: Order[] = [];
  expandedElement: Order[] | null | undefined = [];
  page?: number;
  private userData?: { email: string };

  constructor(private offersService: OffersService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private ordersService: OrderService,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    const {email} = this.usersService.getUserData() as Record<string, string>;
    this.userData = {email};
    this.orders = this.ordersService.getOrders(this.userData).pipe(
      tap((data) => {
        this.dataSource = data;
      })
    );
  }

  orderDetails(details: Order) {
    this.dialog.open(ModalUserOrderTableComponent, {
      width: '700px',
      maxWidth: '100%',
      height: '100%'
    });
    this.ordersService.orderDetails(details);
  }
}
