import { Component } from '@angular/core';
import { NavController,LoadingController,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  
items : any = [];
UserID : number;
notes : string;

  constructor
  (
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage, 
    public http: HttpClient,
    public loading: LoadingController,
    public router: Router
    ) {
   }
  
  ionViewWillEnter(){
    this.getdata();
    this.storage.get('Note').then((val)=>{
      this.notes = val;
    })
  }
  /**
  * List Function to Navigate to other Page
  * Begin
  */
  service(notes) {
    this.storage.get('Note').then((val) => {
      if ( val == null){
        this.router.navigate(['tabs/service']);
      }else if ( val != null){
        this.notes = val;
        this.router.navigate(['tabs/service/'+notes]);
      }
    });
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
  * Function to handling get data for initialize at begining Page
  * Get Flight Data
  *  
  */
  getdata(){
    this.storage.get('DataFlight').then( dataFlight => {
        this.items = dataFlight;
    });
    this.storage.get('Id').then(GetIdUser =>{
      this.UserID = GetIdUser;
    })
  }
  /**
   * @param toRefreshevent 
   */
  doRefresh(event) {
    this.ionViewWillEnter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
