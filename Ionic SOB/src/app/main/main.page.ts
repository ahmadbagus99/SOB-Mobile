import { Component } from '@angular/core';
import { NavController,LoadingController,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

Name:string;
customer:string;
items : any = [];
massage : any = [];
ArrayInput : any = [];
intervalHandle: any = null;
lenghtArray: any = null;
FlightData : any = [];
ID:string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage, 
    public http: HttpClient,
    public loading: LoadingController
    ) {
   }
  
  ionViewDidEnter(){
    this.refresh();
    this.getdata();
    var a = [{
          // name : 'User',
          age : 32
          }], 
        b = [{
          // name : 'User',
          age : 32
        }]
    var cd = a.concat(b)
    var c = a.concat(b.filter((age) => a.indexOf(age) < 0))
    // console.log(c) 
  }

  service(Data) {
    this.storage.set('Name', Data);
    this.navCtrl.navigateForward('/tabs/service');
  }

  home() {
    this.navCtrl.navigateForward('/home');
  }

  sync() {
    this.navCtrl.navigateForward('/tabs/sync');
  }

  product2() {
    this.navCtrl.navigateForward('/tabs/product2');
  }

  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }

  passanger() {
    this.navCtrl.navigateForward('/tabs/passanger');
  }
  sliderOpts = {
    autoplay: true,
    speed:1000
  };
  
  getdata(){
    // console.log('Get Data is running...')
    this.storage.get('FlightData').then((val) => {
        this.items = val;
    });
    this.storage.get('ClosedOrder').then((val) => {
    //  console.log(val);
  });
  }

  refresh(){
    this.getdata();
    // console.log('Begin async operation');

    setTimeout(() => {
      // console.log('Async operation has ended');
    }, 2000);
  }

  doRefresh(event) {
    this.getdata();
    // console.log('Begin async operation');

    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
