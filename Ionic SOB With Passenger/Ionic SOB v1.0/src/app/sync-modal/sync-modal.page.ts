import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sync-modal',
  templateUrl: './sync-modal.page.html',
  styleUrls: ['./sync-modal.page.scss'],
})
export class SyncModalPage {
  users = [
    {User: '300100', Status: 'Active', SyncStatus: 'Done'},
    {User: '300120', Status: 'Active', SyncStatus: 'Done'},
    {User: '300130', Status: 'Not Active', SyncStatus: 'Done'},
    {User: '300140', Status: 'Active', SyncStatus: 'Not yet'}
  ]

  constructor
  (
    public modalController: ModalController
  ) {
   }
  /**
   * Dismiss the modal
   */
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  /**
   * Function to handle sync to creatio
   */
  Syncronize(){
    console.log('Sync is running..')
  }
}
