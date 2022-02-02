import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Observable} from "rxjs";
import {Order} from "../../../models/Order";
import {tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from '@angular/forms';
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class AdminOrdersComponent implements OnInit {


  constructor(private ordersService: OrderService,
              private _snackBar: MatSnackBar) {
  }

  columnsToDisplay = ['name', 'surname', 'email', 'status'];
  expandedElement: Order[] = [];
  orders?: Observable<Order[]>;
  dataSource: Order[] = [];
  totalOrders?: number;
  totalOrdersPrice: number = 0;
  page?: number;

  ngOnInit(): void {
    this.orders = this.ordersService.getOrders().pipe(
      tap((data) => {
        this.totalOrdersPrice = 0;
        this.dataSource = data;
        this.totalOrders = data.length;
        this.dataSource.forEach(i => {
          for (let productKey in i.product) {
            this.totalOrdersPrice += i.product[productKey].price;
          }
        });
      })
    );
  }

  editStatus(id: string, status: string) {
    const statusInfo = Object.assign({_id: id}, status);
    this.ordersService.editStatus(statusInfo).subscribe({
      next: (data) => {
        if (data) {
          this._snackBar.open("Статус заказ успешно изменен!", "Закрыть", {
            duration: 5000
          });
        }
      }
    });
  }

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  getOrdersByDate() {
    this.totalOrdersPrice = 0;
    this.orders = this.ordersService.getOrders(this.range.value).pipe(
      tap((data) => {
        this.dataSource = data;
        this.totalOrders = data.length;
        this.dataSource.forEach(i => {
          for (let productKey in i.product) {
            this.totalOrdersPrice += i.product[productKey].price;
          }
        });
      })
    );
  }
}

