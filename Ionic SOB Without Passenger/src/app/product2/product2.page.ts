import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductFilterService } from '../publicServices/product-filter.service';

@Component({
  selector: 'app-product2',
  templateUrl: './product2.page.html',
  styleUrls: ['./product2.page.scss'],
})
export class Product2Page implements OnInit {

  public searchTerm: string = "";
  items : any = [];

  constructor(
      public navCtrl: NavController,
      public storage: Storage, 
      public alertController: AlertController,
      public http: HttpClient,
      private filterData : ProductFilterService
    ) {
    }
  ionViewWillEnter(){
    this.getdata();
  }
  
  ngOnInit(){
    this.setFilteredItems();
  }

  setFilteredItems() {
    this.items = this.filterData.filterProduct(this.searchTerm);
  }

  order(){
    this.navCtrl.navigateForward('/order');
  }

  home(){
    this.navCtrl.navigateForward('/home');
  }
  payment() {
    this.navCtrl.navigateForward('/payment');
  }
  passanger() {
    this.navCtrl.navigateForward('/passanger');
  }
  sync() {
    this.navCtrl.navigateForward('/sync');
  }
  getdata(){
    this.storage.get('DataProduct').then((val) => {
        this.items = val;
    });
  }
}
