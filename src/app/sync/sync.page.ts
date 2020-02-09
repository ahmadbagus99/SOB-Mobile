import { Component } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage {
  Description:string;
  ConvertJson: any;
  allData: any;
  flightData: any;
  ProductData: any;
  passangerData: any;
  User:string;
  Send: any;
  isLoading = false;
  constructor(public navCtrl: NavController,public storage: Storage, public http: HttpClient,public alertCtrl: AlertController,public loading: LoadingController) { }

  ngOnInit() {
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
  service() {
    this.navCtrl.navigateForward('/service');
  }
  logout(){
    this.storage.set('Active', 'logout');
    this.navCtrl.navigateForward('/login');
  }
  syn(){
    this.present();
    this.upload_data();
    this.sync_flight();
    
  }
  order(){
    this.navCtrl.navigateForward('/order');
  }
  upload_data(){
    this.storage.get('Description').then((val2) => {
      this.Description=val2;
      this.storage.get('ClosedOrder').then((val) => {
        this.Send = val;
        for(let i = 0; i<this.Send.length; i++){
          this.http.get('https://bpmonline.asia/duanyam/KangOL/upload.php?Product='+this.Send[i]['Product']+'&Total='+this.Send[i]['Total']+'&Flight='+this.Send[i]['Flight']+'&Seat='+this.Send[i]['Seat']+'&NamaPassanger='+this.Send[i]['NamaPassanger']+'&NoFlight='+this.Send[i]['NoFlight']+'&Qty='+this.Send[i]['Qty']+'&Desc='+this.Description)
          .subscribe(data => {},
          err => {});
        }
      });
    });
  }
  sync_flight(){
    this.storage.get('Nama').then((val) => {
     
      this.User = val;
      
      if(this.User){

        this.http.get('https://bpmonline.asia/duanyam/KangOL/sync_flight.php?ID='+this.User)
        .subscribe(data => {
            this.flightData = data;
            if(this.flightData.length > 0){
            console.log(this.flightData);
            this.storage.set('FlightData', this.flightData);
            }
            else{
              console.log("Oops!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops!");
        });

        this.http.get('https://bpmonline.asia/duanyam/KangOL/sync_product.php?ID='+this.User)
        .subscribe(data2 => {
            this.ProductData = data2;
            if(this.ProductData.length > 0){
            console.log(this.ProductData);
            this.storage.set('ProductData', this.ProductData);
            }
            else{
              console.log("Oops!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops!");
        });

        this.http.get('https://bpmonline.asia/duanyam/KangOL/sync_passanger.php?ID='+this.User)
        .subscribe(data3 => {
            this.passangerData = data3;
            if(this.passangerData.length > 0){
            console.log(this.passangerData);
            this.storage.set('passangerData', this.passangerData);
            this.storage.set('ClosedOrder', '');
            this.storage.set('Description', '');
            }
            else{
              console.log("Oops!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops!");
        });
    }
  });
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: 'Syncronize Gagal',
      buttons: ['OK']
    });
    await alert.present();
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
}
