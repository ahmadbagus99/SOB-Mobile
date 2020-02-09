import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  ID:string;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient) {
      this.check();

   }

  ngOnInit() {
  }

  check(){
    this.storage.get('Active').then((val) => {
      if(val == 'Active'){
        this.navCtrl.navigateForward('/home');
      }
      else{
        this.navCtrl.navigateForward('/login');
      }
    });
  }

}
