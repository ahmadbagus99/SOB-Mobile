import { Component } from '@angular/core';
import { NavController,LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Integration } from '../publicServices/Integration';
import { equal } from 'assert';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage {
  isLoading = false;

  constructor
  (
    public navCtrl: NavController,
    public storage: Storage, 
    public http: HttpClient, 
    public alertCtrl: AlertController,
    public loading: LoadingController,
    private itGration : Integration
  )
  { }
  /**
   * Alert to show Log Out Confirmation
   * AlertController
   */
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
  /**
   * Alert to show Confirmation Sync to Creatio
   * AlertController
   */
  async SyncConfirmation(){
    const alert = await this.alertCtrl.create({
      message: 'Synchronize to Creatio?',
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
    })
    alert.present();
  }
  /**
   * List Function to Navigate to other Page
   * Begin
   */
  product2() {
    this.navCtrl.navigateForward('/tabs/product2');
  }
  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }
  service() {
    this.navCtrl.navigateForward('/tabs/report-note');
  }
  /**
   * Function to Log Out and Remove Storage
   * Remove 
   */
  logout(){
    this.storage.remove("Active");
    this.storage.remove("ClosedOrder");
    this.storage.remove("Description");
    this.storage.remove("FlightData");
    this.storage.remove("Nama");
    this.storage.remove("Seat");
    this.storage.remove("passangerData");
    this.storage.remove("ProductData");
    this.storage.remove("DataOrder");
    this.storage.remove("NamePassenger");
    this.storage.remove("DataPreOrder");
    this.storage.remove("CloseOrderNew");
    this.navCtrl.navigateForward('login');
  }
  /**
   * Function to Handling Sync to Creatio
   * 
   */
  syn(){
    const temp = [];
    this.storage.get('CloseOrderNew').then(data => {
      const dataOrder = data;

      dataOrder.forEach(product => {
      let id = product.Id
      let total = product.Total
      let sold = product.Sold;
      let check = temp.filter(item =>{
        return item.Id == id;
      }).length > 0;

      if (check){
        let index = temp.findIndex(item =>{
          return item.Id == id;
        })
        temp[index].Total += total;
        temp[index].Sold += sold;
      }else{
        temp.push(product);
      }
      });
     })

    this.storage.get("ProductData").then(data =>{
      var ProductData = data;
      var SyncData = [];
    temp.forEach(ProductList => {
      ProductData.forEach(productData =>{
          if ( productData.ID == ProductList.Id){
            let body = { 
              Id : ProductList.Id,
              Stock : productData.Stock,
              Sold : ProductList.Sold,
              Total : ProductList.Total  
            };
            SyncData.push(body);
          }
      })
    });
     let SyncBody = {
       SalesMovementRecordId : '1',
       Status : 'Closing',
       ProductList : SyncData
     }
     console.log(SyncBody)
     this.itGration.postData(SyncBody, 'sync/mobile-to-local').subscribe(async data=>{
       if (data.success == true){
         const alert = await this.alertCtrl.create({
           message: data.message,
           buttons: ['OK']
         });
         alert.present();
       }else{
        const alert = await this.alertCtrl.create({
          message: data.message,
          buttons: ['OK']
        });
        alert.present();
       }
     })
     })
  }
}
