import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  constructor(public loading: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public router : Router
    ) { }

  ngOnInit() {
  }

  verificationPage(){
    this.http.get('https://bpmonline.asia/duanyam/KangOL/user.php?ID='+this.username+'&Pass='+this.password)
    .subscribe(data => {
      console.log(data);
        this.item_product = data;
        if(this.item_product.length > 0){
        this.ConvertJson = JSON.stringify(this.item_product);
        this.allData = JSON.parse(this.ConvertJson);
          this.storage.set('Active', 'Active');
          this.storage.set('Nama', this.allData[0]['ID']);
          this.router.navigate(['tabs/main'])
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

    async presentAlert() {
      const alert = await this.alertCtrl.create({
        message: 'User Not Found!',
        buttons: ['OK']
      });
      await alert.present();
    }
}
