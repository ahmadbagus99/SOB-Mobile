import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Integration{
    server: string = "https://citilink-sales.bpmonline.asia/api/";
    // server: string = "http://localhost:8000/";
    constructor
    (
        public http: Http
    ){ }
    /**
     * @param# API Integration
     * Post Request 
     */
    postRequest(body, file){
        return this.http.post(this.server + file, JSON.stringify(body))
        .map(res => res.json());
    }
    /**
     * @param# API Integration
     * Put Request 
     */
    putRequest(body, file){
        return this.http.put(this.server + file, JSON.stringify(body))
        .map(res => res.json());
    }
    /**
     * @param# API Integration
     * Get Request 
     */
    getRequest(file, param){
        return this.http.get(this.server + file + param)
        .map(res => res.json());
    }
}