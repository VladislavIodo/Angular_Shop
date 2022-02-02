import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {MatDialog} from "@angular/material/dialog";
import {Offer} from "../../models/Offer";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  public cartButton = {
    titleOffer: "Купить сейчас",
    titleOfferAll: "Купить одним заказом",
    titleOfferDel: "Удалить товар",
  };

  totalPrice: number = 0;
  private price: Offer[] = [];

  constructor(private cartService: CartService,
              public dialog: MatDialog) {
  }

  getOfferInCart(): Offer[] {
    this.price = JSON.parse(<string>localStorage.getItem('offer'));
    let totalPrice: number = 0;
    this.price.forEach(item => {
      totalPrice += item.price;
    });
    this.totalPrice = totalPrice;
    return this.cartService.getOfferInCart();
  }

  ngOnInit(): void {
  }

  deleteAllOfferFromCart() {
    this.cartService.deleteAllOfferFromCart();
  }

  deleteOfferFromCart(offer: Offer) {
    this.cartService.deleteOfferFromCart(offer);
  }


  openDialogOrderToBuy(offer: Offer) {
    this.cartService.openDialogOrderToBuy(offer);
  }

  openDialogOrderToBuyAll() {
    this.cartService.openDialogOrderToBuyAll(this.totalPrice);
  }
}
