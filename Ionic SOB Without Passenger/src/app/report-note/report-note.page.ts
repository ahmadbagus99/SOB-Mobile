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
      if ( val != null){
        this.Note = val;
      }else if (val == null){
        let body = {
          note: 'You dont have Report'
        }
        this.Note.push(body);
      }
    })
  }
}
