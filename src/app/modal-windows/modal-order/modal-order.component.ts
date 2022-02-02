import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS, StepperOrientation} from "@angular/cdk/stepper";
import {CartService} from "../../services/cart.service";
import {MatDialog} from "@angular/material/dialog";
import {Order} from "../../models/Order";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Offer} from "../../models/Offer";
import {Observable} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {TooltipPosition} from '@angular/material/tooltip';


@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.component.html',
  styleUrls: ['./modal-order.component.less'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})

export class ModalOrderComponent implements OnInit {
  disabledStepper = true;
  public orderFormName!: FormGroup;
  public orderFormAddress!: FormGroup;
  public orderFormPayment!: FormGroup;
  public offer: Offer[] = [];
  public totalPrice: number = 0;

  public order: {} = {};
  stepperOrientation: Observable<StepperOrientation>;

  public get name() {
    return this.orderFormName?.get("name");
  }

  public get surname() {
    return this.orderFormName?.get("surname");
  }

  public get email() {
    return this.orderFormName?.get("email");
  }

  public get city() {
    return this.orderFormName?.get("city");
  }

  public get street() {
    return this.orderFormName?.get("street");
  }

  public get payment() {
    return this.orderFormName?.get("payment");
  }


  constructor(private cartService: CartService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  cityGroups: CityGroup[] = [
    {
      name: 'Минская область',
      city: [
        {value: 'Минск', viewValue: 'Минск'},
      ]
    },
    {
      name: 'Гродненская область',
      city: [
        {value: 'Гродно', viewValue: 'Гродно'}
      ]
    },
    {
      name: 'Брестская область',
      city: [
        {value: 'Брест', viewValue: 'Брест'}
      ]
    }
  ];
  position: TooltipPosition[] = ['right'];

  ngOnInit() {
    this.orderFormName = new FormGroup({
      name: new FormControl("", [Validators.required]),
      surname: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required,
        Validators.email])
    });
    this.orderFormAddress = new FormGroup({
      city: new FormControl("", Validators.required),
      street: new FormControl("", [Validators.required])
    });
    this.orderFormPayment = new FormGroup({
      payment: new FormControl("", Validators.required)
    });

    this.orderFormName.patchValue({
      name: JSON.parse(<string>localStorage.getItem("userInfo")).userName,
      surname: JSON.parse(<string>localStorage.getItem("userInfo")).userSurname,
      email: JSON.parse(<string>localStorage.getItem("userInfo")).email
    });
  }

  buyProductAll() {
    this.totalPrice = this.cartService.getTotalPrice();
    this.order = Object.assign(this.orderFormName.value,
      this.orderFormAddress.value,
      this.orderFormPayment.value,
      {product: JSON.parse(<string>localStorage.getItem('offer'))},
      {totalPrice: this.totalPrice}
    );
    this.cartService.buyProduct(<Order>this.order).subscribe({
      next: (data) => {
        if (data) {
          this._snackBar.open("Ваш заказ успешно оформлен! В ближайшее время курьер свяжется свами", "Закрыть", {
            duration: 5000
          });
          this.cartService.deleteAllOfferFromCart();
          this.dialog.closeAll();
        }
      }
    });
  }

  buyProduct() {
    this.offer = this.cartService.getOrder();
    this.totalPrice = this.cartService.getTotalPrice();
    this.order = Object.assign(this.orderFormName.value,
      this.orderFormAddress.value,
      this.orderFormPayment.value,
      {product: this.offer},
      {totalPrice: this.totalPrice});
    this.cartService.buyProduct(<Order>this.order).subscribe({
      next: (data) => {
        if (data) {
          this._snackBar.open("Ваш заказ успешно оформлен! В ближайшее время курьер свяжется свами", "Закрыть", {
            duration: 5000
          });
          this.cartService.deleteOfferFromCart(this.offer[0]);
          this.dialog.closeAll();
        }
      }
    });
  }

  isAllOrder() {
    return this.cartService.isAllOrder();
  }
}
