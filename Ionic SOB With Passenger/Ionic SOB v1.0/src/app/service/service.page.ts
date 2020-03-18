import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router'

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
Note = "";

  constructor
  (
    public navCtrl: NavController,
    public storage: Storage, 
    public alertController: AlertController,
    public http: HttpClient,
    public actRoute: ActivatedRoute
  ) { 
    this.actRoute.params.subscribe((data: any)=>{
      this.Description = data.notes;
    })
  }

  ionViewWillEnter(){
    this.storage.get('Name').then((val) => {
      this.Name=val;
    });
    this.storage.get('customer').then((val) => {
      this.customer=val;
    });
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
   * @function# to Add Description
   */
  async save(){
    this.storage.set('Note', this.Description)
    const alert = await this.alertController.create({
      message: 'Success Added!',
    })
    alert.present();
    setTimeout(()=>{
        alert.dismiss();
      }, 1000)
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
