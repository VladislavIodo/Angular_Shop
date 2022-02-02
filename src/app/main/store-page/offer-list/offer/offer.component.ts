import {Component, Input, OnInit} from '@angular/core';
import {CartService} from "../../../../services/cart.service";
import {FavoritesService} from "../../../../services/favorites.service";
import {Offer} from "../../../../models/Offer";

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.less']
})
export class OfferComponent implements OnInit {
  titleDetails = "Подробнее";
  titleCart = "Добавить в корзину";

  @Input() offers!: Offer;
  @Input() isFavorite: boolean = false;

  constructor(private cartService: CartService, private favoritesService: FavoritesService) {
  }

  addOfferToCart(offersData: Offer) {
    this.cartService.addOfferToCart(offersData);
  }

  addOfferToFavorites(offersData: Offer) {
    this.favoritesService.addOfferToFavorites(offersData);
    this.isFavorite = this.getFavoriteState(this.offers._id);
  }

  ngOnInit(): void {
    this.isFavorite = this.getFavoriteState(this.offers._id);
  }

  getFavoriteState(offerId: string): boolean {
    return this.favoritesService.getFavoriteStateById(offerId);
  }

}
