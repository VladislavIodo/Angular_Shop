import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../services/order.service";
import {Offer} from "../../models/Offer";

@Component({
  selector: 'app-modal-user-order-table',
  templateUrl: './modal-user-order-table.component.html',
  styleUrls: ['./modal-user-order-table.component.less']
})
export class ModalUserOrderTableComponent implements OnInit {

  orderDetails: Offer[] = [];
  totalPrice: number = 0;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderDetails = this.orderService.getOrderDetails();
    this.orderDetails.forEach((item: Offer) => {
      this.totalPrice += item.price;
    });
  }
}
