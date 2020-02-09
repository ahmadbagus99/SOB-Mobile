import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  public currentNumber = 0;
  Name:string;
  Description:string;
  Address:string;
  isLoading = false;
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

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.present();
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
      this.items3 = val;
      for(let i = 0; i<this.items3.length; i++){
        this.currentNumber = this.currentNumber + this.items3[i]['Total'];
      }
    });

  }
  async present() {
    this.isLoading = true;
    return await this.loading.create({
      spinner: null,
      message: 'Search...',
      translucent: true,
      duration: 2000,
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loading.dismiss();
  }
  

  home(){
    this.navCtrl.navigateForward('/home');
  }
  cancel(){
    this.navCtrl.navigateForward('/product');
  }
  closed(){
    this.present();
    this.ConvertJson = JSON.stringify(this.items);
    this.allData = JSON.parse(this.ConvertJson);

    this.ConvertJson2 = JSON.stringify(this.items2);
    this.allData2 = JSON.parse(this.ConvertJson2);

    this.storage.get('ClosedOrder').then((val) => {
      this.allData3 = val;
      if(this.allData3){
        for(let ii = 0; ii<this.allData3.length; ii++){
          this.ArrayInput = { 
            Product : this.allData3[ii]['Product'], 
            Total : this.allData3[ii]['Total'], 
            Passanger : this.allData[0]['ID'],
            Flight : this.allData2[0]['ID'],
            Seat : this.seat,
            NamaPassanger : this.allData[0]['Nama'],  
            NoFlight : this.allData2[0]['No'], 
            Qty : this.allData3[ii]['Qty']
          };
          this.AddArray.push(this.ArrayInput);
        }
      }
      for(let i = 0; i<this.items3.length; i++){
        this.ArrayInput = { 
          Product : this.items3[i]['Product'], 
          Total : this.items3[i]['Total'], 
          Passanger : this.allData[0]['ID'],
          Flight : this.allData2[0]['ID'],
          Seat : this.seat,
          NamaPassanger : this.allData[0]['Nama'],  
          NoFlight : this.allData2[0]['No'],  
          Qty : this.items3[i]['Qty']
        };
        this.AddArray.push(this.ArrayInput);
      }
      this.storage.set('ClosedOrder', this.AddArray);
    });
    
    this.navCtrl.navigateForward('/home');
  }
  product(){
    this.navCtrl.navigateForward('/product');
  }

  sync() {
    this.navCtrl.navigateForward('/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/payment');
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
