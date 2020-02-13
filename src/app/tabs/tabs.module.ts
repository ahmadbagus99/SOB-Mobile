import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'service', loadChildren: '../service/service.module#ServicePageModule' },
      { path: 'waiting', loadChildren: '../waiting/waiting.module#WaitingPageModule' },
      { path: 'order', loadChildren: '../order/order.module#OrderPageModule' },
      { path: 'payment', loadChildren: '../payment/payment.module#PaymentPageModule' },
      { path: 'passanger', loadChildren: '../passanger/passanger.module#PassangerPageModule' },
      { path: 'product', loadChildren: '../product/product.module#ProductPageModule' },
      { path: 'product2', loadChildren: '../product2/product2.module#Product2PageModule' },
      { path: 'main', loadChildren: '../main/main.module#MainPageModule' },
      { path: 'sync', loadChildren: '../sync/sync.module#SyncPageModule' },
      { path: 'contact', loadChildren: '../contact/contact.module#ContactPageModule' },
      { path: 'flight', loadChildren: '../flight/flight.module#FlightPageModule' },
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/main',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
