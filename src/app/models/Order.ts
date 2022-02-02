import {Offer} from "./Offer";

export interface Order {
  userName: string,
  userSurname: string,
  email: string,
  city: string,
  street: string,
  payment: string,
  product: Offer[],
  totalPrice: number,
  date: Date,
  status: string
}
