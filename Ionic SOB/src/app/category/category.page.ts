import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Storage } from '@ionic/storage';
import { ProductFilterService } from '../publicServices/product-filter.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  public searchTerm: string = "";
  items : any = [];
  Breads = [];
  InstantNoodles = [];
  Biscuits = [];

  constructor
    (
    public storage: Storage,
    private filterData : ProductFilterService,
    public actRoute: ActivatedRoute
    ) { }

    ngOnInit(){
      this.setFilteredItems();
    }

    ionViewWillEnter(){
      this.actRoute.params.subscribe((data :any)=>{
        console.log(data)
        this.storage.get('DataProduct').then((val) => {
          this.items = val;
      });
      })
    }

  setFilteredItems() {
    this.items = this.filterData.filterProduct(this.searchTerm);
  }

}
