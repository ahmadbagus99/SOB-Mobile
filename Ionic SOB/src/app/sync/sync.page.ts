import { Component } from '@angular/core';
import { NavController,LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Integration } from '../publicServices/Integration';


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

  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public http: HttpClient, 
    public alertCtrl: AlertController,
    public loading: LoadingController,
    private itGration : Integration
  )
  { }

  async ConfirmLogOut(){
    let alert = await this.alertCtrl.create({
      message: 'Are You Sure? ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }

  home() {
    this.navCtrl.navigateForward('/tabs/home');
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
  service() {
    this.navCtrl.navigateForward('/tabs/service');
  }
  logout(){
    this.storage.set('Active', 'logout');
    this.navCtrl.navigateForward('login');
    /*
    Remove Storage 
    */
   this.storage.remove("Active");
   this.storage.remove("ClosedOrder");
   this.storage.remove("Description");
   this.storage.remove("FlightData");
   this.storage.remove("Nama");
   this.storage.remove("Seat");
   this.storage.remove("passangerData");
   this.storage.remove("ProductData");
   this.storage.remove("DataOrder");
  }
  syn(){
     //Sync to Creatio
     this.storage.get("ProductData").then(data =>{
       var ProductData = data;
       var SyncData = [];
     if(ProductData){
       for(let data = 0; data<ProductData.length; data++){
         let body = { 
           Id : ProductData[data]['ID'],
           Stock : ProductData[data]['Stock'],
           Sold : ProductData[data]['Sold'],
           Total : ProductData[data]['Total']   
         };
         SyncData.push(body);
       }
     }
     let SyncBody = {
       SalesRecordMovement : '',
       Status : 'Closing',
       ProductList : SyncData
     }
     console.log(SyncBody)
     this.itGration.postData(SyncBody, 'sync/mobile-to-local').subscribe(data=>{
       console.log(data);
     })
     })
    // this.present();
    // this.upload_data();
    // this.sync_flight();
  }
  order(){
    this.navCtrl.navigateForward('/order');
  }
  upload_data(){
    this.storage.get('Nama').then((val3) => {
    this.User = val3;
    this.storage.get('Description').then((val2) => {
      this.Description=val2;
      this.storage.get('ClosedOrder').then((val) => {
        this.Send = val;
        for(let i = 0; i<this.Send.length; i++){
          this.http.get('https://bpmonline.asia/duanyam/KangOL/upload.php?Product='+this.Send[i]['Product']+'&Total='+this.Send[i]['Total']+'&Flight='+this.Send[i]['Flight']+'&Seat='+this.Send[i]['Seat']+'&NamaPassanger='+this.Send[i]['NamaPassanger']+'&NoFlight='+this.Send[i]['NoFlight']+'&Qty='+this.Send[i]['Qty']+'&Desc='+this.Description+'&User='+this.User)
          .subscribe(data => {},
          err => {});
        }
      });
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
              console.log("Oops Flight!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops Flight!");
        });

        this.http.get('https://bpmonline.asia/duanyam/KangOL/sync_product.php?ID='+this.User)
        .subscribe(data2 => {
            this.ProductData = data2;
            if(this.ProductData.length > 0){
            console.log(this.ProductData);
            this.storage.set('ProductData', this.ProductData);
            }
            else{
              console.log("Oops Product!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops Product!");
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
              console.log("Oops Passanger!");
              this.presentAlert();
          }
        },
        err => {
          this.presentAlert();
          console.log("Oops Passanger!");
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
}
