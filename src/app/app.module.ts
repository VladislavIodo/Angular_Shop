import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SectionCustomerChoiceComponent} from './main/section-customer-choice/section-customer-choice.component';
import {SectionAboutComponent} from './main/section-about/section-about.component';
import {ModalLoginComponent} from './modal-windows/modal-login/modal-login.component';
import {ButtonComponent} from './reusable-components/button/button.component';
import {AboutStoreComponent} from './main/about-store/about-store.component';
import {HeaderComponent} from './header/header.component';
import {SearchFormComponent} from './main/store-page/search-form/search-form.component';
import {CatalogComponent} from './main/catalog/catalog.component';
import {FooterComponent} from './footer/footer.component';
import {LogoComponent} from './reusable-components/logo/logo.component';
import {ModalRegistrationComponent} from './modal-windows/modal-registration/modal-registration.component';
import {OfferListComponent} from './main/store-page/offer-list/offer-list.component';
import {AppRoutingModule} from "./app-routing.module";
import {FilterComponent} from './main/store-page/filter/filter.component';
import {MainComponent} from './main/main.component';
import {NotFoundComponent} from './main/not-found/not-found.component';
import {OfferComponent} from './main/store-page/offer-list/offer/offer.component';
import {StorePageComponent} from './main/store-page/store-page.component';
import {OffersService} from "./services/offers.service";
import {CartComponent} from './main/cart/cart.component';
import {CartService} from "./services/cart.service";
import {FavoritesComponent} from './main/favorites/favorites.component';
import {FavoritesService} from "./services/favorites.service";
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RestService} from "./services/rest.service";
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MapComponent} from './footer/map/map.component'
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatMenuModule} from "@angular/material/menu";
import {SwiperModule} from "swiper/angular";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserAccComponent} from './main/user-acc/user-acc.component';
import {AdminAccComponent} from './main/admin-acc/admin-acc.component';
import {ModalOrderComponent} from './modal-windows/modal-order/modal-order.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {UserOrdersComponent} from './main/user-acc/user-orders/user-orders.component';
import {UserSettingsComponent} from './main/user-acc/user-settings/user-settings.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {OfferDetailsComponent} from './main/store-page/offer-details/offer-details.component';
import {ModalUserOrderTableComponent} from './modal-windows/modal-user-order-table/modal-user-order-table.component';
import {AddProductComponent} from './main/admin-acc/add-product/add-product.component';
import {DeleteProductComponent} from './main/admin-acc/add-product/delete-product/delete-product.component';
import {NgxPaginationModule} from "ngx-pagination";
import {MatSliderModule} from "@angular/material/slider";
import {NgxCaptchaModule} from 'ngx-captcha';
import {ReCaptchaService} from "./services/re-captcha.service";
import {AdminOrdersComponent} from './main/admin-acc/admin-orders/admin-orders.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {NgChartsModule} from "ng2-charts";
import {StatisticsComponent} from './main/admin-acc/statistics/statistics.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {WarehouseComponent} from './main/admin-acc/warehouse/warehouse.component';
import {TokenInterceptor} from "./tokenInterceptors/token.interceptors";
import {JwtModule} from "@auth0/angular-jwt";
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
  declarations: [
    AppComponent,
    SectionCustomerChoiceComponent,
    SectionAboutComponent,
    ModalLoginComponent,
    AboutStoreComponent,
    AppComponent,
    HeaderComponent,
    SearchFormComponent,
    CatalogComponent,
    FooterComponent,
    LogoComponent,
    ModalRegistrationComponent,
    ButtonComponent,
    OfferListComponent,
    FilterComponent,
    MainComponent,
    NotFoundComponent,
    OfferComponent,
    StorePageComponent,
    CartComponent,
    FavoritesComponent,
    MapComponent,
    UserAccComponent,
    AdminAccComponent,
    ModalOrderComponent,
    AdminOrdersComponent,
    UserOrdersComponent,
    UserSettingsComponent,
    OfferDetailsComponent,
    ModalUserOrderTableComponent,
    AddProductComponent,
    DeleteProductComponent,
    StatisticsComponent,
    WarehouseComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    MatBadgeModule,
    MatProgressBarModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    SwiperModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgxPaginationModule,
    MatSliderModule,
    NgxCaptchaModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgChartsModule,
    MatTooltipModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
      },
    }),
    MatSidenavModule
  ],
  providers: [
    OffersService,
    CartService,
    FavoritesService,
    RestService,
    MatSnackBar,
    ReCaptchaService,
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    MatSnackBar,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
