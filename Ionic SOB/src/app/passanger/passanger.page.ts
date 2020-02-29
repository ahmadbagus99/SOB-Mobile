import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { equal } from 'assert';


@Component({
  selector: 'app-passanger',
  templateUrl: './passanger.page.html',
  styleUrls: ['./passanger.page.scss'],
})
export class PassangerPage {

  Passenger = [];
 

  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public alertController: AlertController,
    public http: HttpClient
  ) { }

  ionViewWillEnter(){
    this.storage.get('DataPassenger').then( dataPassenger => {
      this.Passenger = dataPassenger.map( data => data.Seat);
      // console.log(this.Passenger)
      let newArr = this.Passenger.sort();
    })
  }

  home(){
    this.navCtrl.navigateForward('/home');
  }
  waiting(x){
    this.storage.set('Seat', x);
    this.navCtrl.navigateForward('/tabs/waiting');
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
}
