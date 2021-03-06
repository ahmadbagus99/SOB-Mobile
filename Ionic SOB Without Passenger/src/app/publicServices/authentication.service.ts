import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage, 
    private plt: Platform
  ) {
    this.plt.ready()
      .then(() => {
        this.checkToken();
      })
  }
  
  checkToken(){
    this.storage.get('Id').then(res =>{
      if (res){
        this.authenticationState.next(true);
      }
    })
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
