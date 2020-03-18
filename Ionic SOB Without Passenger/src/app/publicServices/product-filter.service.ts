import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

public ProductData = [];

  constructor(private storage : Storage) 
  { 
    this.LoadDataProduct();
  }
  
  LoadDataProduct(){
    this.storage.get("DataProduct").then((data) =>{
      this.ProductData = data;
    });
  }

  filterProduct(searchTerm){
    return this.ProductData.filter(item =>{
      return item.Nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
