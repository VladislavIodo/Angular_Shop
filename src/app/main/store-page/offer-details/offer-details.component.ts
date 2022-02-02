import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {Offer} from "../../../models/Offer";
import {ActivatedRoute, Params} from "@angular/router";
import {OffersService} from "../../../services/offers.service";
import {tap} from "rxjs/operators";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.less']
})
export class OfferDetailsComponent implements OnInit {

  public offerDetails: Observable<Offer> | undefined;


  constructor(private route: ActivatedRoute,
              private offersService: OffersService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.offerDetails = this.route.params.pipe(
      switchMap((params: Params) => this.offersService.getOfferDetails(params["id"])),
      tap((offerDetails: Offer) => console.log("offerDetails", offerDetails)));
  }

  openDialogOrderToBuy(offerDetails: Offer) {
    this.cartService.openDialogOrderToBuy(offerDetails);
  }

  addOfferToCart(offerDetails: Offer) {
    this.cartService.addOfferToCart(offerDetails);
  }
}
