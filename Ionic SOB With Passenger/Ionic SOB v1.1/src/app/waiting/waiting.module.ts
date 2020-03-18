import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { IonicModule } from '@ionic/angular';

import { WaitingPage } from './waiting.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [HTTP,CallNumber],
  declarations: [WaitingPage]
})
export class WaitingPageModule {}
