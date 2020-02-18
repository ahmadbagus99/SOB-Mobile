import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage {
  
  public currentNumber = 0;
  isLoading : boolean = true;
  items : any = [];
  ArrayInput : any = [];
  ConvertJson: any;
  allData: any;
  ConvertJson2: any;
  allData2: any;
  ConvertJson3: any;
  allData3: any;
  seat:string;
  items2 : any = [];
  items3 : any = [];
  public AddArray:Array<string> = new Array();
  NamePassenger : string;
  ProductChoose : string;
  
  constructor
  (
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertController: AlertController
  ) { 
  }

  ionViewWillEnter(){
    this.getData();
  }
  /**
   * @function# to get Data
   * Passenger
   * Flight
   * Data Order
   */
  async getData(){
    const loading = await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md',
    });
    loading.present();
    this.storage.get('DataPreOrder').then(data =>{
      this.NamePassenger = data.map(dataFilter => dataFilter.NamaPassanger).toString();
      this.ProductChoose = data.map(dataFilter => dataFilter.Product).toString();
    })
    this.storage.get('DataPassenger').then((val) => {
      this.items = val;
        this.storage.get('Seat').then((val2) => {
          this.seat = val2;
      });
    });
    this.storage.get('DataFlight').then((val2) => {
      this.items2 = val2;
    });
    this.storage.get('DataOrder').then((val) => {
      loading.dismiss().then(()=>{
        this.isLoading = false;
        this.items3 = val;
      })
      this.currentNumber = 0;
      for(let i = 0; i<this.items3.length; i++){
        this.currentNumber = this.currentNumber + this.items3[i]['Total'];
      }
    });
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
  home(){
    this.navCtrl.navigateForward('/tabs/main');
  }
  cancel(){
    this.storage.remove('DataOrder');
    this.navCtrl.navigateForward('/tabs/product');
  }
  /**
  * List Function to Navigate to other Page
  * End
  */
  /** -------------------------------------------- */
  /**
   * @function# to handling Order product 
   * Button Confirmation
   */
  async closed(){
  const loading = await this.loading.create({
    message : "",
    spinner: 'crescent',
    translucent : true,
    cssClass:'custom-loader-class',
    mode: 'md',
  });
  loading.present();
  // this.ConvertJson = JSON.stringify(this.items);
  // this.allData = JSON.parse(this.ConvertJson);

  // this.ConvertJson2 = JSON.stringify(this.items2);
  // this.allData2 = JSON.parse(this.ConvertJson2);

  this.storage.get('DataOrder').then((val) => {
    this.allData3 = val;
    this.AddArray = [];
    // if(this.allData3){
    //   for(let ii = 0; ii<this.allData3.length; ii++){
    //     this.ArrayInput = { 
    //       Product : this.allData3[ii]['Product'], 
    //       Total : this.allData3[ii]['Total'], 
    //       Passanger : this.allData[0]['ID'],
    //       Flight : this.allData2[0]['ID'],
    //       Seat : this.allData3[0]['Seat'],
    //       NamaPassanger : this.allData[0]['Nama'],  
    //       NoFlight : this.allData2[0]['No'], 
    //       Qty : this.allData3[ii]['Qty'],
    //     };
    //     this.AddArray.push(this.ArrayInput);
    //   }
    // }
    /**
     * Set Data Close Order
     */
    var CloseOrder = [];
    this.storage.get('CloseOrderNew').then(data =>{
      if (data == null){
        CloseOrder = [];
        this.allData3.forEach(DataOrder => {
          if(DataOrder.Total != 0){
            let body = {
              Id : DataOrder.Id,
              NamaPassanger : this.NamePassenger,
              Seat : this.seat,
              Product : DataOrder.Product,
              Sold : DataOrder.Qty,
              Total : DataOrder.Total
          }
          CloseOrder.push(body);
          this.storage.set('CloseOrderNew', CloseOrder);
          }
        });
      }else{
        CloseOrder = data;
        this.allData3.forEach(DataOrder => {
          if(DataOrder.Total != 0){
            let body = {
              Id : DataOrder.Id,
              NamaPassanger : this.NamePassenger,
              Seat : this.seat,
              Product : DataOrder.Product,
              Sold : DataOrder.Qty,
              Total : DataOrder.Total
          }
          CloseOrder.push(body);
          this.storage.set('CloseOrderNew', CloseOrder);
          }
        });
      }
    })
    /**
     * Update Product Qty
     */
    var DataProduct = [];
    if(this.allData3){
      for(let data = 0; data<this.allData3.length; data++){
        let body = { 
          ID : this.allData3[data]['Id'],
          Nama : this.allData3[data]['Product'], 
          Price : this.allData3[data]['Price'],
          Stock : this.allData3[data]['Stock'] - this.allData3[data]['Qty'],
          Flight : this.allData3[data]['Flight'],
          Passanger : this.allData3[data]['Passenger'],
          User : this.allData3[data]['User'],
          Qty : this.allData3[data]['Qty'],
          Total : this.allData3[data]['Total']
        };
        DataProduct.push(body);
      }
    }
    loading.dismiss().then(async ()=>{
      this.isLoading = false;
      this.storage.set('DataProduct', DataProduct);
      this.storage.set('ClosedOrder', this.AddArray);
      const alert = await this.alertController.create({
        message: 'Success Added!',
      })
      alert.present();
      setTimeout(()=>{
        alert.dismiss();
      }, 1000)
    })
  });
  this.navCtrl.navigateForward('/tabs/main');
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
  product(){
    this.navCtrl.navigateForward('/tabs/product');
  }
  sync() {
    this.navCtrl.navigateForward('/tabs/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }
  /**
  * @param toRefreshevent 
  */
  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
