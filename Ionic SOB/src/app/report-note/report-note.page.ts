import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-report-note',
  templateUrl: './report-note.page.html',
  styleUrls: ['./report-note.page.scss'],
})
export class ReportNotePage {

Note = [];
Number : [];

  constructor
  (
    public storage: Storage
  ) 
  { }

  ionViewWillEnter(){
    this.storage.get('Note').then((val) =>{
      this.Note = val;
    })
  }
}
