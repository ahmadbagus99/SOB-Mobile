import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AuthenticationService } from '../publicServices/authentication.service';
import { Integration } from '../publicServices/Integration';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username:string;
  password:string;
  isLoading = false;

  constructor
  (
    public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public router : Router,
    private authenticationService: AuthenticationService,
    private integration : Integration,
  ) { }

  async Login(){
    const loading = await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md'
    });
    loading.present();
    let body = {
      username : this.username,
      password : this.password
    }
    this.integration.postRequest(body, 'login')
    .subscribe( async Login => {
      if (Login.success){
        const alert = await this.alertCtrl.create({
          message: Login.message
        })
        alert.present();
        setTimeout(() => {
          alert.dismiss();
        }, 1000);
        this.storage.set('DataLogin', Login.data);
        this.storage.set('Id', Login.data.ID).then(()=>{
          /**
         * Sync Local to Mobile
         * with @param ID
         */
        this.integration.getRequest('sync/local-to-mobile/sync/', Login.data.SalesRecordMovementId).subscribe( SyncData =>{
          /**
          * Set Data Flight
          */
          var DataFilght = [];
          DataFilght.push(SyncData.data.Flight)
          this.storage.set('DataFlight', DataFilght);
          /**
          * Set Data Passenger
          */
          this.storage.set('DataProduct', SyncData.data.Product);
          /**
          * Set Data Passenger
          */
          this.storage.set('DataPassenger', SyncData.data.Passenger);
        })
        })
        loading.dismiss().then(()=>{
          this.authenticationService.authenticationState.next(true);
        })
      }else{
        loading.dismiss().then(async()=>{
          const alert = await this.alertCtrl.create({
            message: Login.message
          })
          alert.present();
          setTimeout(() => {
            alert.dismiss();
          }, 1000);
        })
      }
    })
    }
}
