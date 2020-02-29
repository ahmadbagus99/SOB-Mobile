import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
})
export class DetailOrderPage implements OnInit {
NamePassenger : string;
Order : any = [];
DataFlight : any = [];
Date : string;
Seat : string;
No : any = [];

  constructor
  (
    public storage: Storage,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.storage.get('DataFlight').then(dataFlight=>{
      this.DataFlight = dataFlight;
      var date = dataFlight.map(data => data.Time).toString();
      this.Date = date.substring(-1, date.length-11);
    })
    this.actRoute.params.subscribe((data : any)=>{
      this.NamePassenger = data.NamaPassanger;
      this.Seat = data.Seat;
    })
    this.storage.get('CloseOrderNew').then(dataOrder =>{
      let i = 1;
      dataOrder.forEach(data => {
        if ( data.NamaPassanger == this.NamePassenger){
          let body = {
            No: i++,
            Id: data.Id,
            NamaPassanger: data.NamaPassanger,
            Seat: data.Seat,
            Product: data.Product,
            Sold: data.Sold,
            Total: data.Total
          }
          this.Order.push(body);
        }
      });
    })
  }
}
