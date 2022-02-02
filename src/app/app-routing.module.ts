import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./main/not-found/not-found.component";
import {MainComponent} from "./main/main.component";
import {StorePageComponent} from "./main/store-page/store-page.component";
import {CartComponent} from "./main/cart/cart.component";
import {AboutStoreComponent} from "./main/about-store/about-store.component";
import {FavoritesComponent} from "./main/favorites/favorites.component";
import {AuthGuard} from "./auth.guard";
import {UserAccComponent} from "./main/user-acc/user-acc.component";
import {AdminAccComponent} from "./main/admin-acc/admin-acc.component";
import {UserOrdersComponent} from "./main/user-acc/user-orders/user-orders.component";
import {UserSettingsComponent} from "./main/user-acc/user-settings/user-settings.component";
import {OfferDetailsComponent} from "./main/store-page/offer-details/offer-details.component";
import {AddProductComponent} from "./main/admin-acc/add-product/add-product.component";
import {AdminOrdersComponent} from "./main/admin-acc/admin-orders/admin-orders.component";
import {StatisticsComponent} from "./main/admin-acc/statistics/statistics.component";
import {WarehouseComponent} from "./main/admin-acc/warehouse/warehouse.component";


const childRoutesUser: Routes = [
  {
    path: "orders", component: UserOrdersComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'user'
    }
  },
  {
    path: "settings", component: UserSettingsComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'user'
    }
  }
];

const childRoutesAdmin: Routes = [{
  path: "orders", component: AdminOrdersComponent,
  canActivate: [AuthGuard],
  data: {
    role: 'admin'
  }
}, {
  path: "statistics", component: StatisticsComponent,
  canActivate: [AuthGuard],
  data: {
    role: 'admin'
  }
}, {
  path: "warehouse", component: WarehouseComponent,
  canActivate: [AuthGuard],
  data: {
    role: 'admin'
  }
}, {
  path: "productManager", component: AddProductComponent,
  canActivate: [AuthGuard],
  data: {
    role: 'admin'
  }
}
];

const routes: Routes = [
  {path: "", redirectTo: '/home', pathMatch: 'full'},
  {path: "home", component: MainComponent},
  {
    path: 'admin', component: AdminAccComponent, children: childRoutesAdmin,
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: 'user', component: UserAccComponent, children: childRoutesUser,
    canActivate: [AuthGuard],
    data: {
      role: 'user'
    }
  },
  {path: "favorites", component: FavoritesComponent},
  {path: "cart", component: CartComponent},
  {path: "store", component: StorePageComponent},
  {path: "store/:id/:name/details", component: OfferDetailsComponent},
  {path: "favorites/:id/:name/details", component: OfferDetailsComponent},
  {path: "home/:id/:name/details", component: OfferDetailsComponent},
  {path: "about", component: AboutStoreComponent},
  {path: "home", component: MainComponent},
  {path: "**", component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
