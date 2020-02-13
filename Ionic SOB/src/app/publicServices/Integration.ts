// import { Injectable } from '@angular/core';
// import { Headers, Http, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';

// @Injectable()
// export class PostProvider   {
//     // server: string = "https://cors-anywhere.herokuapp.com/http://bpmonline.asia/CRM_Local/";
//     server: string = "http://bpmonline.asia/CRM_Local/";
//     constructor(public http: Http)
//     {}
//     postData(body, file){
//         let type = 'application/json; charset=UTF-8';
//         let headers = new Headers ({'Content-type':type});
//         let options = new RequestOptions ({ headers: headers});

//         return this.http.post(this.server + file, JSON.stringify(body), options)
//         .map(res => res.json());
//     }
// }