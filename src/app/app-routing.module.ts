import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'service', loadChildren: './service/service.module#ServicePageModule' },
  { path: 'waiting', loadChildren: './waiting/waiting.module#WaitingPageModule' },
  { path: 'order', loadChildren: './order/order.module#OrderPageModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentPageModule' },
  { path: 'passanger', loadChildren: './passanger/passanger.module#PassangerPageModule' },
  { path: 'product', loadChildren: './product/product.module#ProductPageModule' },
  { path: 'product2', loadChildren: './product2/product2.module#Product2PageModule' },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'sync', loadChildren: './sync/sync.module#SyncPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'flight', loadChildren: './flight/flight.module#FlightPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
