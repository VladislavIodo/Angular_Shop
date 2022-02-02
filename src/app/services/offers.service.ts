import {Injectable} from '@angular/core';
import {Offer} from "../models/Offer";
import {BehaviorSubject, Observable} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {RestService} from "./rest.service";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class OffersService {
  public reloadTrigger$ = new BehaviorSubject<void>(undefined);
  private categoryTrigger$ = new BehaviorSubject<Offer[]>([]);

  constructor(private restService: RestService) {
    this.getOffers().subscribe((data) => {
      this.categoryTrigger$.next(data);
    });
  }

  getOffersByCategoryOrAll(): Observable<Offer[]> {
    return this.categoryTrigger$;
  }

  getOffers(category?: any): Observable<Offer[]> {
    return this.reloadTrigger$.pipe(
      switchMap(() => {
        let params = new HttpParams();
        for (const categoryKey in category) {
          !category.search && (params = params.append(`cat${categoryKey}`, category [categoryKey]));
        }
        category?.search && (params = params.append("search", category?.search));
        return this.restService.get<{ message: string, offers: Offer[] }>("/store", {params});
      }),
      map((res) => res.offers),
      tap((res) => {
        this.categoryTrigger$.next(res);
      })
    );
  }

  getOfferDetails(id: Offer["_id"]): Observable<Offer> {
    return this.reloadTrigger$.pipe(
      switchMap(() => {
        return this.restService.get<Offer>(`/store/offers/${id}`);
      })
    );
  }

  public addProduct(
    description: string,
    designer: string,
    price: number,
    category: string,
    name: string,
    availability: number,
    partNumber: number,
    image: File): Observable<{ message: string }> {

    const formData: FormData = new FormData();
    formData.append("description", description);
    formData.append("designer", designer);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("name", name);
    formData.append("availability", availability.toString());
    formData.append("partNumber", partNumber.toString());
    formData.append("image", image, image.name);
    return this.restService.post<{ message: string }>("/store", formData).pipe(
      tap(({message}) => {
        console.log("message", message);
        this.reloadTrigger$.next();
      }),
    );
  }

  public deleteProduct(partNumber: number): Observable<any> {
    return this.restService.delete(`/store/delete/${partNumber}`)
      .pipe(tap(({message}) => {
        console.log("message", message);
        this.reloadTrigger$.next();
      }));
  }

  public getSpecificProduct(partNumber: number): Observable<Offer> {
    return this.restService.get<Offer>("/store/" + partNumber);
  }

  public editProduct(
    description: string,
    designer: string,
    price: number,
    category: string,
    name: string,
    availability: number,
    partNumber: number,
    image: File
  ) {
    const formData: FormData = new FormData();
    formData.append("description", description);
    formData.append("designer", designer);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("name", name);
    formData.append("partNumber", partNumber.toString());
    formData.append("availability", availability.toString());
    formData.append("image", image, image.name);
    return this.restService.put<{ message: string }>(`/store/edit/${partNumber}`, formData)
      .pipe(
        tap(({message}) => {
          console.log("message", message);
          this.reloadTrigger$.next();
        })
      );
  }
}
