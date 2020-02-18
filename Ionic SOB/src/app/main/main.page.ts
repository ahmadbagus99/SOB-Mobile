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
  
items : any = [];
  constructor
  (
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage, 
    public http: HttpClient,
    public loading: LoadingController
    ) {
   }
  
  ionViewDidEnter(){
    this.getdata();
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
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
  /**
  * List Function to Navigate to other Page
  * End
  */

  /** -------------------------------------------- */
  
  /**
  * Function to handling get data for initialize at begining Page
  * Get Flight Data
  *  
  */
  getdata(){
    this.storage.get('FlightData').then((val) => {
        this.items = val;
    });
  }
  /**
   * @param toRefreshevent 
   */
  doRefresh(event) {
    this.getdata();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
