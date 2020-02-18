import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductFilterService } from '../publicServices/product-filter.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public searchTerm: string = "";
  public currentNumber = 0;
  public total = 0;
  public grand = 0;
  public ArrayInput : any = [];
  public ArrayInput2 : any = [];
  public AddArray:Array<string> = new Array();
  public AddArray2:Array<string> = new Array();
  items : any = [];
  product : any = [];
  Seat : string;
  NamePassenger : string;
  
  constructor
  (
    public navCtrl: NavController,
    public storage: Storage, 
    public alertController: AlertController,
    public http: HttpClient,
    private filterData : ProductFilterService
  ) {
  }
  
  ionViewWillEnter(){
    this.getdata();
    this.AddArray = [];
  }
  ngOnInit(){
    this.setFilteredItems();
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
  sync() {
    this.navCtrl.navigateForward('/tabs/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }
  waiting() {
    this.navCtrl.navigateForward('/tabs/waiting');
  }
  /**
  * List Function to Navigate to other Page
  * End
  */
 /** -------------------------------------------- */

  /**
   * @function# to handling Search Data
   * Data Product
   */
  setFilteredItems() {
    this.items = this.filterData.filterProduct(this.searchTerm);
  }
  /**
  * @function# to get Data 
  * #Product
  * #Seat
  * #Passenger Name
  */
  getdata(){
    this.storage.get('DataProduct').then((val) => {
        this.items = val;
    });
    this.storage.get('Seat').then((val2) => {
      this.Seat = val2;
  });
    this.storage.get('NamePassenger').then(val3 => {
      this.NamePassenger = val3;
    })
  }
  /**
   * @function# to handling Set Data 
   * #Order
   * #Pre Order 
   */
  order(){
    this.AddArray2 = [];
    for(let i = 0; i<this.items.length; i++){
      this.total = 0;
      this.grand = 0;
      
      for(let ii = 0; ii<this.AddArray.length; ii++){
        if(this.items[i]['Nama'] == this.AddArray[ii]['Product'] && this.AddArray[ii]['Qty'] > 0){
          this.total = this.total + this.AddArray[ii]['Qty'];
          this.grand = this.grand + parseInt(this.AddArray[ii]['Price']);
        } 
      }
      this.ArrayInput2 = { 
        Id : this.items[i]['ID'],
        Product : this.items[i]['Nama'], 
        Price : this.items[i]["Price"],
        User : this.items[i]["User"],
        Passenger : this.items[i]["Passenger"],
        Flight : this.items[i]['Flight'], 
        Stock : this.items[i]['Stock'],
        Seat : this.Seat,
        Qty : this.total,
        Total : this.grand
      };
      this.AddArray2.push(this.ArrayInput2);
    }
    /**
     * Data Close Order
     */
      var DataPreOrder = [];
          let body = {
            NamaPassanger : this.NamePassenger,
            Seat : this.Seat,
            Product : this.AddArray[0]['Product']
        }
        DataPreOrder.push(body);
        this.storage.set('DataPreOrder', DataPreOrder);
    this.storage.set('DataOrder', this.AddArray2);
    this.navCtrl.navigateForward('/tabs/order');
  }
  /**
   * @param Product 
   * @param Price 
   * @param Seat 
   */
  public increment (Product, Price, Seat) {
    this.ArrayInput = { Product : Product, Price : Price, Seat : Seat, Qty : 1};
    this.AddArray.push(this.ArrayInput);
  }
  /**
   * @param Product
   * @param Price 
   * @param Seat 
   */
  public decrement (Product, Price, Seat) {
      this.ArrayInput = { Product : Product, Price : Price, Seat : Seat, Qty : -1};
      this.AddArray.push(this.ArrayInput);
  }
  /**
   * @function# to Sum Price and Qty
   * @param Product 
   * @param Price 
   * @param Seat 
   */
  suma (Product, Price, Seat){
    this.currentNumber = 0;
    for(let i = 0; i<this.AddArray.length; i++){
      if(this.AddArray[i]['Product'] == Product && this.AddArray[i]['Seat'] == Seat){
        this.currentNumber = this.currentNumber + this.AddArray[i]['Qty'];
      }    
    }
    return this.currentNumber;
  }
  
}
