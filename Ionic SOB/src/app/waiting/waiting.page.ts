import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.page.html',
  styleUrls: ['./waiting.page.scss'],
})
export class WaitingPage {
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
  ConvertJson2: any;
  allData: any;
  seat:string;
  

  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertController: AlertController,
    private callNumber: CallNumber
    ) { 
  }

  ionViewWillEnter(){
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
    this.navCtrl.navigateForward('/tabs/home');
  }

  product(){
    this.navCtrl.navigateForward('/tabs/product');
  }
  passanger(){
    this.navCtrl.navigateBack('/tabs/passanger');
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
  callphone(number:string){
    console.log(number);
    this.callNumber.callNumber(number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Contractor Not Find',
      buttons: ['OK']
    });

    await alert.present();
  }
}