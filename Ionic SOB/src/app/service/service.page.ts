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
export class ServicePage {
  
Name:string;
Description:string;
Address:string;
sendData:Observable<any>;
customer:string;
Note = [];

  constructor
  (
    public navCtrl: NavController,
    public storage: Storage, 
    public alertController: AlertController,
    public http: HttpClient
  ) { 
  }

  ionViewWillEnter(){
    this.storage.get('Name').then((val) => {
      this.Name=val;
    });
    this.storage.get('customer').then((val) => {
      this.customer=val;
    });
    this.storage.get('Description').then((val) => {
      this.Description=val;
    });
    this.storage.get('Note').then((val) =>{
      this.Note = val;
    })
  }
  /**
   * List Function to Navigate to other Page
   * Begin
   */
  home(){
    this.navCtrl.navigateForward('/tabs/main');
  }
  sync() {
    this.navCtrl.navigateForward('/tabs/sync');
  }
  payment() {
    this.navCtrl.navigateForward('/tabs/payment');
  }
  /**
  * List Function to Navigate to other Page
  * End
  */
  /** -------------------------------------------- */

  /**
   * @function# to Add Description
   */
  save(){
    var Note = [];
    this.storage.get('Note').then(data =>{
    if ( data == null){
      const Note = [];
      let body = {
        note: this.Description
      }
      Note.push(body)
      this.storage.set('Note', Note);
    }else{
      Note = data;
      let body = {
        note: this.Description
      }
      Note.push(body)
      this.storage.set('Note', Note);
    }
    })
    this.navCtrl.navigateForward('/tabs/main');
  }
  async presentAlert() {
  const alert = await this.alertController.create({
    message: 'Please input data',
    buttons: ['OK']
  });
  await alert.present();
  }

}
