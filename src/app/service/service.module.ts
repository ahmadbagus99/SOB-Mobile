import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicModule } from '@ionic/angular';
import { ServicePage } from './service.page';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  {
    path: '',
    component: ServicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    IonicStorageModule.forRoot()
  ],
  providers: [HTTP],
  declarations: [ServicePage]
})
export class ServicePageModule {}
