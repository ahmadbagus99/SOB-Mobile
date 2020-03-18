import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductFilterService } from '../publicServices/product-filter.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-product2',
  templateUrl: './product2.page.html',
  styleUrls: ['./product2.page.scss'],
})
export class Product2Page implements OnInit {

  public searchTerm: string = "";
  items : any = [];
  Breads = [];
  InstantNoodles = [];
  Biscuits = [];
  
  constructor(
      public navCtrl: NavController,
      public storage: Storage, 
      public alertController: AlertController,
      public http: HttpClient,
      private filterData : ProductFilterService,
      public router : Router
    ) {
    }
  ionViewWillEnter(){
    this.getdata();
    this.ProductFilter();
  }
  ProductFilter(){
    this.storage.get('DataProduct').then( data => {
     /**
      * Filter Product
      * @Breads_Filter
      */
     data.forEach(ProductFilter => {
       if ( ProductFilter.Nama == "Roti Pisang Cokelat"){
         this.Breads.push(ProductFilter);
       }
       if ( ProductFilter.Nama == "Roti Tuna Mayo"){
        this.Breads.push(ProductFilter);
       }
     });
    /**
     * Filter Product
     * @Instant_Noodles_OR_Hot_Snake
     */
    data.forEach(ProductFilter => {
      if ( ProductFilter.Nama == "Pop Mie Ayam Jumbo 75gr"){
        this.InstantNoodles.push(ProductFilter);
      }
      if ( ProductFilter.Nama == "Pop Mie Baso Jumbo 75gr"){
        this.InstantNoodles.push(ProductFilter);
      }
      if ( ProductFilter.Nama == "Chuanki Express 35gr"){
        this.InstantNoodles.push(ProductFilter);
      }
      if ( ProductFilter.Nama == "Popso Seblak"){
        this.InstantNoodles.push(ProductFilter);
      }
      if ( ProductFilter.Nama == "Koko Krunch Combo Pack 32gr"){
        this.InstantNoodles.push(ProductFilter);
      }
    });
    /**
     * Filter Product
     * @Biscuits_OR_Chocolates_OR_Candy
     */
      data.forEach(ProductFilter => {
        if ( ProductFilter.Nama == "Pringles Chips"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Loaker Wafer"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Lays Rumput Laut"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Fisherman Candy"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Kit Kat 2F"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Oreo Vanilla 29gr"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Fitbar Nuts 24gr"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Fitbar Chocolate 24gr"){
          this.Biscuits.push(ProductFilter);
        }
        if ( ProductFilter.Nama == "Fitbar Fruit 24gr"){
          this.Biscuits.push(ProductFilter);
        }
      });
   })
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
  productCategory(productCategory){
    this.router.navigate(['tabs/category/'+productCategory]);
  }
}
