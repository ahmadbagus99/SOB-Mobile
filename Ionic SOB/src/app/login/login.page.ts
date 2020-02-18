import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../publicServices/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username:string;
  password:string;
  item_product : any = [];
  Password:string;
  ConvertJson: any;
  allData: any;
  Description:string;
  flightData: any;
  ProductData: any;
  passangerData: any;
  User:string;
  isLoading = false;

  constructor(public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public router : Router,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
  }

  async verificationPage(){
    const loading = await this.loading.create({
      message : "",
      spinner: 'crescent',
      translucent : true,
      cssClass:'custom-loader-class',
      mode: 'md'
    });
    loading.present();
    this.http.get('https://bpmonline.asia/duanyam/KangOL/user.php?ID='+this.username+'&Pass='+this.password)
    .subscribe(data => {
        this.item_product = data;
        if(this.item_product.length > 0){
        this.ConvertJson = JSON.stringify(this.item_product);
        this.allData = JSON.parse(this.ConvertJson);
        this.storage.set('Active', 'Active');
        this.storage.set('Nama', this.allData[0]['ID']).then(()=>{
          this.sync();
        })
          loading.dismiss().then(()=>{
            this.authenticationService.authenticationState.next(true);
          })
        }
        else{
          console.log("Oops!");
          loading.dismiss().then(()=>{
            this.AlertLogin();
          })
      }
    },
    err => {
      this.AlertLogin();
      console.log("Oops!");
    });  
    }

    async AlertLogin() {
      const alert = await this.alertCtrl.create({
        message: 'User Not Found!',
        buttons: ['OK']
      });
      await alert.present();
    }

    sync(){
      this.storage.get('Nama').then((val) => {
        this.User = val;
        if(this.User){
          this.http.get('https://bpmonline.asia/duanyam/KangOL/sync_flight.php?ID='+this.User)
          .subscribe(data => {
              this.flightData = data;
              if(this.flightData.length > 0){
              // console.log(this.flightData);
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
              // console.log(this.ProductData);
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
              // console.log(this.passangerData);
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
