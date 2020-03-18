import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage {
  public currentNumber = 0;
  Name:string;
  Description:string;
  Address:string;
  isLoading = false;
  items = [];
  items2 : any = [];
  ArrayInput : any = [];
  current:string;
  mitra:string;
  ConvertJson: any;
  allData: any;
  Total : number;
  TotalPerPassenger : number;
  temp = [];

  constructor
  (
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public router: Router,
    public alertController: AlertController
  ) { 
  }

  ionViewWillEnter() {
    this.getData();
  }
/**
 * GetData Order Passenger
 * 
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
  loading.dismiss().then(()=>{
    this.storage.get('CloseOrderNew').then( data => {
      if ( data != null){
        this.items = data;
        this.Total = 0;
        data.forEach(dataOrder => {
          this.Total += dataOrder.Total
        });
  
        this.temp = [];
        data.forEach(dataOrder => {
            let name = dataOrder.NamaPassanger;
            let total = dataOrder.Total
            
            let check = this.temp.filter(item =>{
              return item.NamaPassanger == name;
            }).length > 0;
  
            if (check){
              let index = this.temp.findIndex(item =>{
                return item.NamaPassanger == name;
              })
              this.temp[index].Total += total;
            }else{
              this.temp.push(dataOrder);
            }
        });
      }else if( data == null){
        this.temp = [];
        let body = {
          NamaPassanger: 'No Passenger   Selected',
          Seat: 'No Seat',
          Sold: '0',
          Total: '0'
        }
        this.temp.push(body)
      }
    });
    this.storage.get('FlightData').then((val2) => {
      this.items2 = val2;
    });
  })
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
  DetailOrder(NamaPassanger, Seat){
    this.router.navigate(['tabs/detail-order/'+ Seat + '/' + NamaPassanger])
  }
  home(){
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
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}

