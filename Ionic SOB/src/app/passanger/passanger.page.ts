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
  PassengerSeat = [];

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
      this.PassengerSeat = [];
      for(let i=0; i<30; i++) {
        const seatItem = {
          no: i+1,
          seatA: this.CheckSeat(`${i+1}A`) ? 'kotak-baris' : 'kotak-baris baris-kosong',
          seatB: this.CheckSeat(`${i+1}B`) ? 'kotak-baris' : 'kotak-baris baris-kosong',
          seatC: this.CheckSeat(`${i+1}C`) ? 'kotak-baris' : 'kotak-baris baris-kosong',
          seatD: this.CheckSeat(`${i+1}D`) ? 'kotak-baris' : 'kotak-baris baris-kosong',
          seatE: this.CheckSeat(`${i+1}E`) ? 'kotak-baris' : 'kotak-baris baris-kosong',
          seatF: this.CheckSeat(`${i+1}F`) ? 'kotak-baris' : 'kotak-baris baris-kosong'
        };

        this.PassengerSeat.push(seatItem);
      }
    })
  }

  home(){
    this.navCtrl.navigateForward('/home');
  }
  waiting(x){
    if(this.CheckSeat(x)) {
      this.storage.set('Seat', x);
      this.navCtrl.navigateForward('/tabs/waiting');
    }
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
  CheckSeat(seat) {
    const isSeatExists = this.Passenger.filter(item => {
      return item == seat;
    }).length > 0;

    return isSeatExists;
  }
}
