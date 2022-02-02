import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ModalOrderComponent} from "../modal-windows/modal-order/modal-order.component";
import {MatDialog} from "@angular/material/dialog";
import {RestService} from "./rest.service";
import {Order} from "../models/Order";
import {Offer} from "../models/Offer";
import {tap} from "rxjs/operators";
import {OffersService} from "./offers.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private offerCart: Offer[] = [];
  private numberGoodsList = new BehaviorSubject<Offer[]>([]);
  private generatedOrder: Offer[] = [];
  private totalPrice: number = 0;
  private order: boolean | undefined;

  numberGoods() {
    return this.numberGoodsList.asObservable();
  }

  getOfferInCart(): Offer[] {
    return this.offerCart = JSON.parse(<string>localStorage.getItem('offer'));
  }

  addOfferToCart(offersData: Offer) {
    this.offerCart.push(offersData);
    localStorage.setItem('offer', JSON.stringify(this.offerCart));
    this.numberGoodsList.next(this.offerCart);
  }

  constructor(public dialog: MatDialog,
              private restService: RestService,
              private offersService: OffersService) {
  }

  deleteAllOfferFromCart() {
    this.offerCart = [];
    localStorage.setItem('offer', JSON.stringify(this.offerCart));
    this.numberGoodsList.next(this.offerCart);
  }

  deleteOfferFromCart(offer: Offer) {
    const deleteOfferFromCart: Offer[] = JSON.parse(<string>localStorage.getItem('offer'));
    this.offerCart = deleteOfferFromCart.filter(item => item._id !== offer._id);
    localStorage.setItem('offer', JSON.stringify(this.offerCart));
    this.numberGoodsList.next(this.offerCart);
  }

  buyProduct(order: Order): Observable<{ message: string, order: Order }> {
    return this.restService.put<{ message: string, order: Order }>("/order/ordering", order).pipe(
      tap(() => {
        this.offersService.reloadTrigger$.next();
      })
    );
  }

  openDialogOrderToBuy(offer: Offer) {
    this.dialog.open(ModalOrderComponent, {
      maxWidth: '900px',
      width: '100%',
      height: '100%'
    });
    this.generatedOrder.length = 0;
    this.generatedOrder.push(offer);
    this.totalPrice = offer.price;
    this.order = true;
  }

  openDialogOrderToBuyAll(totalPrice: number) {
    this.dialog.open(ModalOrderComponent, {
      maxWidth: '900px',
      width: '100%',
      height: '100%'
    });
    this.totalPrice = totalPrice;
    this.order = false;
  }

  isAllOrder() {
    return this.order;
  }

  getOrder() {
    return this.generatedOrder;
  }

  getTotalPrice() {
    return this.totalPrice;
  }
}
