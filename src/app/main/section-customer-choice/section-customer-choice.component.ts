import {OffersService} from "../../services/offers.service";
import {Offer} from "../../models/Offer";
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import SwiperCore, {Navigation} from "swiper";
import {FavoritesService} from "../../services/favorites.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-section-customer-choice',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './section-customer-choice.component.html',
  styleUrls: ['./section-customer-choice.component.less']
})
export class SectionCustomerChoiceComponent implements OnInit {

  constructor(private offersService: OffersService, private favoritesService: FavoritesService) {
  }

  getFavoriteState(offerId: string): boolean {
    return this.favoritesService.getFavoriteStateById(offerId);
  }

  breakpoints = {
    360: {slidesPerView: 1, spaceBetween: 20},
    640: {slidesPerView: 1, spaceBetween: 20},
    768: {slidesPerView: 1, spaceBetween: 20},
    1024: {slidesPerView: 2, spaceBetween: 20}
  };

  public _offers$?: Observable<Offer[]>;
  public _offers: Offer[] = [];

  ngOnInit(): void {
    this._offers$ = this.offersService.getOffers().pipe(
      tap((data) => {
        this._offers = data;
        console.log("offers", this._offers);
      })
    );
  }
}
