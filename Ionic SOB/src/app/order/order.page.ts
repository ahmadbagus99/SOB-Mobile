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
  Name:string;
  Description:string;
  Address:string;
  isLoading : boolean = true;
  items : any = [];
  ArrayInput : any = [];
  current:string;
  mitra:string;
  ConvertJson: any;
  allData: any;
  ConvertJson2: any;
  allData2: any;
  ConvertJson3: any;
  allData3: any;
  seat:string;
  items2 : any = [];
  items3 : any = [];
  MasterDataProduct = [];
  public AddArray:Array<string> = new Array();

  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertController: AlertController) { 
    this.refresh();
    this.getData();
  }

  ionViewWillEnter(){
    this.getData();
    this.storage.get("ProductData").then(data =>{
      this.MasterDataProduct = data;
    })
  }

  async getData(){
    const loading = await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md',
    });
    loading.present();

    this.storage.get('passangerData').then((val) => {
      this.items = val;
        this.storage.get('Seat').then((val2) => {
          this.seat = val2;
      });
    });

    this.storage.get('FlightData').then((val2) => {
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

  async dismiss() {
    this.isLoading = false;
    return await this.loading.dismiss();
  }
  
  home(){
    this.navCtrl.navigateForward('/tabs/main');
  }
  cancel(){
    this.storage.remove('DataOrder');
    this.navCtrl.navigateForward('/tabs/product');
  }
  async closed(){
    const loading = await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md',
    });
    loading.present();

    this.ConvertJson = JSON.stringify(this.items);
    this.allData = JSON.parse(this.ConvertJson);

    this.ConvertJson2 = JSON.stringify(this.items2);
    this.allData2 = JSON.parse(this.ConvertJson2);

    this.storage.get('DataOrder').then((val) => {
      this.allData3 = val;
      if(this.allData3){
        for(let ii = 0; ii<this.allData3.length; ii++){
          this.ArrayInput = { 
            Product : this.allData3[ii]['Product'], 
            Total : this.allData3[ii]['Total'], 
            Passanger : this.allData[0]['ID'],
            Flight : this.allData2[0]['ID'],
            Seat : this.allData3[ii]['Seat'],
            NamaPassanger : this.allData[0]['Nama'],  
            NoFlight : this.allData2[0]['No'], 
            Qty : this.allData3[ii]['Qty'],
          };
          this.AddArray.push(this.ArrayInput);
        }
      }
      //Update Product Qty
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
      loading.dismiss().then(()=>{
        this.isLoading = false;
        this.storage.set('ProductData', DataProduct);
        this.storage.set('ClosedOrder', this.AddArray);
      })
    });
    
    this.navCtrl.navigateForward('/tabs/main');
  }
  product(){
    this.navCtrl.navigateForward('/tabs/product');
  }

  sync() {
    this.navCtrl.navigateForward('/tabs/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }

  doRefresh(event) {
    this.getData();
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  refresh(){
    this.getData();
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
    }, 2000);
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Error...',
      buttons: ['OK']
    });

    await alert.present();
  }
}
