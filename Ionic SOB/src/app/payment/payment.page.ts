import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
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
    public alertController: AlertController) { 
    this.refresh();
    this.getData();
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.present();
    this.storage.get('ClosedOrder').then((val) => {
      this.allData=val;
      this.currentNumber =0;
      for(let i = 0; i<this.allData.length; i++){
        this.currentNumber = this.currentNumber + this.allData[i]['Total'];
      }
    });
    this.storage.get('FlightData').then((val2) => {
      this.items2 = val2;
    });
  }
  

  async present() {
    this.isLoading = true;
    return await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md',
      duration: 2000
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

