import { Component } from '@angular/core';
import { NavController,LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Integration } from '../publicServices/Integration';
import { SyncModalPage } from '../sync-modal/sync-modal.page'

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
    public loadingCtrl: LoadingController,
    private integration : Integration,
    public modalController: ModalController
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
      message: 'Are You Sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.syn();
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
  /**
   * Function to Log Out and Remove Storage
   * Remove 
   */
  logout(){
    this.storage.remove("CloseOrderNew");
    this.storage.remove("ClosedOrder");
    this.storage.remove("DataFlight");
    this.storage.remove("DataLogin");
    this.storage.remove("DataOrder");
    this.storage.remove("DataPassenger");
    this.storage.remove("DataPreOrder");
    this.storage.remove("DataProduct");
    this.storage.remove("Id");
    this.storage.remove("NamePassenger");
    this.storage.remove("Seat");
    this.storage.remove("Note")
    this.navCtrl.navigateForward('login');
  }
  /**
   * Function to Handling Sync to Creatio
   * 
   */
  async syn(){
    const loading = await this.loadingCtrl.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md',
    });
    loading.present();
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
    
    this.storage.get("DataProduct").then(data =>{
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
       Status : 'Closing',
       ProductList : SyncData
     }
    this.storage.get('DataLogin').then(DataLogin =>{
      this.integration.postRequest(SyncBody, `sync/mobile-to-local/sync/${DataLogin.SalesRecordMovementId}`).subscribe(async data=>{
        loading.dismiss().then(async ()=>{
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
    })
    })
  }
/**
 * Button open Modal
 */
async SyncCreatio(){
const modal = await this.modalController.create({
 component: SyncModalPage 
});
return await modal.present();
}

}
