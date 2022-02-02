import { Component, OnInit } from '@angular/core';
import {FavoritesService} from "../../services/favorites.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.less']
})
export class FavoritesComponent implements OnInit {

  constructor(private favoritesService: FavoritesService) { }

  getOfferInFavorites():any[]{
    return this.favoritesService.getFavoriteOffers()
  }

  getFavoriteState(offerId: string): boolean {
    return this.favoritesService.getFavoriteStateById(offerId)
  }

  ngOnInit(): void {
  }

}
