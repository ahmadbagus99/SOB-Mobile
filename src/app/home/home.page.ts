import { Component } from '@angular/core';
import { NavController,LoadingController,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
Name:string;
customer:string;
items : any = [];
massage : any = [];
ArrayInput : any = [];
intervalHandle: any = null;
lenghtArray: any = null;
FlightData : any = [];

  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public http: HttpClient) {
    this.refresh();
    this.getdata();
  }
  service(Data) {
    this.storage.set('Name', Data);
    this.navCtrl.navigateForward('/service');
  }
  home() {
    this.navCtrl.navigateForward('/home');
  }
  sync() {
    this.navCtrl.navigateForward('/sync');
  }
  product2() {
    this.navCtrl.navigateForward('/product2');
  }
  payment() {
    this.navCtrl.navigateForward('/payment');
  }
  passanger() {
    this.navCtrl.navigateForward('/passanger');
  }
  sliderOpts = {
    autoplay: true,
    speed:1000
  };
  
  

  getdata(){
    this.storage.get('FlightData').then((val) => {
        this.items = val;
    });
    this.storage.get('ClosedOrder').then((val) => {
     console.log(val);
  });
  }

  refresh(){
    this.getdata();
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
    }, 2000);
  }

  doRefresh(event) {
    this.getdata();
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
