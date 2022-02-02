import {Injectable} from '@angular/core'
import {BehaviorSubject} from "rxjs";
import {Offer} from "../models/Offer";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private offerFavorites: any[] = [];
  private numberFavoritesList = new BehaviorSubject<any>([]);

  numberFavorites() {
    return this.numberFavoritesList.asObservable();
  }

  constructor() {
    const preservedFavorites: any[] = JSON.parse(<string>localStorage.getItem('favorites'));
    if (preservedFavorites) {
      this.offerFavorites = preservedFavorites
    }
  }

  updateStorage(): void {
    localStorage.setItem('favorites', JSON.stringify(this.offerFavorites))
  }

  getFavoriteOffers(): any[] {
    return this.offerFavorites;
  }

  getFavoriteStateById(offerId: string): boolean {
    return !!this.getFavoriteOffers().find(offer => offer._id === offerId)
  }

  addOfferToFavorites(offersData: Offer) {
    if (this.offerFavorites.find(offer => offer._id === offersData._id)) {
      this.offerFavorites = this.offerFavorites.filter(offer => offer._id !== offersData._id)
    } else {
      this.offerFavorites.push(offersData)
    }

    this.updateStorage()
    this.numberFavoritesList.next(this.offerFavorites);
    return this.offerFavorites;
  }
}
