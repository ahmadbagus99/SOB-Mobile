import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public currentNumber = 0;
  public total = 0;
  public grand = 0;
  items : any = [];
  public ArrayInput : any = [];
  public ArrayInput2 : any = [];
  product : any = [];
  User:string;
  public AddArray:Array<string> = new Array();
  public AddArray2:Array<string> = new Array();

  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public alertController: AlertController,
    public http: HttpClient) {
    this.getdata();
   }

  ngOnInit() {}
  getdata(){
    this.storage.get('ProductData').then((val) => {
        this.items = val;
    });
    this.storage.get('Seat').then((val2) => {
      this.User = val2;
  });
    
  }
  order(){

    
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
        Product : this.items[i]['Nama'], 
        Price : this.items[i]['Nama'], 
        Flight : this.items[i]['Flight'], 
        Qty : this.total,
        Seat : this.User,
        Total : this.grand
      };
      this.AddArray2.push(this.ArrayInput2);
    }

    this.storage.set('DataOrder', this.AddArray2);
    this.navCtrl.navigateForward('/order');
  }
  home(){
    this.navCtrl.navigateForward('/home');
  }

  public increment (Product, Price, Seat) {
    this.ArrayInput = { Product : Product, Price : Price, Seat : Seat, Qty : 1};
    this.AddArray.push(this.ArrayInput);
  }

  public decrement (Product, Price, Seat) {
      this.ArrayInput = { Product : Product, Price : Price, Seat : Seat, Qty : -1};
      this.AddArray.push(this.ArrayInput);
  }

  sync() {
    this.navCtrl.navigateForward('/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/payment');
  }
  waiting() {
    this.navCtrl.navigateForward('/waiting');
  }

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
