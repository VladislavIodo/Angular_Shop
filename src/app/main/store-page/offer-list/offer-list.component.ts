import {Component, OnInit} from '@angular/core';
import {OffersService} from "../../../services/offers.service";
import {FavoritesService} from "../../../services/favorites.service";
import {Offer} from "../../../models/Offer";
import {Observable} from "rxjs";

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.less']
})
export class OfferListComponent implements OnInit {
  public _offers$: Observable<Offer[]> | undefined;
  public page: any;

  constructor(private offersService: OffersService, private favoritesService: FavoritesService) {
  }

  getFavoriteState(offerId: string): boolean {
    return this.favoritesService.getFavoriteStateById(offerId);
  }

  ngOnInit(): void {
    this._offers$ = this.offersService.getOffersByCategoryOrAll();
  }

  pageClick() {
    window.scrollTo(0, 200);
  }
}
