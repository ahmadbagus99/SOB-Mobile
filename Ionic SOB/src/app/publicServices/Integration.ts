import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Integration{
    // server: string = "https://citilink-sales.bpmonline.asia/apiv2/";
    server: string = "http://localhost:8000/";
    constructor(public http: Http)
    {}
    postData(body, file){
        return this.http.post(this.server + file, JSON.stringify(body))
        .map(res => res.json());
    }
}