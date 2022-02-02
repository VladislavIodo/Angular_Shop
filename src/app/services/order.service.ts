import {Injectable} from '@angular/core';
import {Offer} from "../models/Offer";
import {Order} from "../models/Order";
import {BehaviorSubject, Observable} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {HttpParams} from "@angular/common/http";
import {RestService} from "./rest.service";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  constructor(private restService: RestService) {
  }

  private reloadTrigger$ = new BehaviorSubject<void>(undefined);
  public product: Offer[] = [];

  getOrders(parameters?: any): Observable<Order[]> {
    return this.reloadTrigger$.pipe(
      switchMap(() => {
        let params = new HttpParams();
        if (parameters !== undefined) {
          parameters.email && (params = params.append(`email`, parameters.email));
          for (const parameterKey in parameters) {
            parameters.end == null && !parameters.email && (params = params.append(`date${parameterKey}`, parameters[parameterKey]));
            parameters.start == null && !parameters.email && (params = params.append(`date${parameterKey}`, parameters[parameterKey]));
            parameters.start != null && parameters.end != null && !parameters.email && (params = params.append(`date${parameterKey}`, parameters[parameterKey]));
          }
        }
        return this.restService.get<{ message: string, orders: Order[] }>('/user/orders', {params});
      }),
      map((res) => res.orders)
    );
  }

  editStatus(statusInfo: { _id: string } & string): Observable<{ message: string }> {
    const id = statusInfo._id;
    return this.restService.put<{ message: string }>(`/order/editStatus/${id}`, statusInfo)
      .pipe(tap(({message}) => {
          console.log("message", message);
          this.reloadTrigger$.next();
        })
      );
  }

  orderDetails(details: Order) {
    this.product = details.product;
  }

  getOrderDetails(): Offer[] {
    return this.product;
  }
}
