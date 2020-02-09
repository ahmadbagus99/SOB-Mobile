import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
items : any = [];
Name:string;
Description:string;
Address:string;
sendData:Observable<any>;
customer:string;
ConvertJson: any;
allData: any;
number:number;
current:string;


  constructor(public navCtrl: NavController,public storage: Storage, public alertController: AlertController,public http: HttpClient) { 
    this.storage.get('Name').then((val) => {
      this.Name=val;
    });
    this.storage.get('customer').then((val) => {
      this.customer=val;
    });
    this.storage.get('Description').then((val) => {
      this.Description=val;
    });
  }

  home(){
    this.navCtrl.navigateForward('/home');
  }
  save(){
    this.storage.set('Description', this.Description);
    this.navCtrl.navigateForward('/home');
  }
  sync() {
    this.navCtrl.navigateForward('/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/payment');
  }
 
  ngOnInit() {

  }

   async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Please input data',
      buttons: ['OK']
    });

    await alert.present();
  }

}
