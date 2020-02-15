import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

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
  items : any = [];
  items2 : any = [];
  ArrayInput : any = [];
  current:string;
  mitra:string;
  ConvertJson: any;
  allData: any;
  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertController: AlertController
    ) { 
  }

  ionViewWillEnter() {
    this.getData();
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
    loading.dismiss().then(()=>{
      this.storage.get('CloseOrderNew').then( data => {
        this.items = data;
      });
      this.storage.get('FlightData').then((val2) => {
        this.items2 = val2;
      });
    })
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
      message: 'Contractor Not Find',
      buttons: ['OK']
    });

    await alert.present();
  }
  
}

