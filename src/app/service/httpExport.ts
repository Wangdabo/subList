import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions , Response , URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
// import {HttpParams, HttpHeaders} from '_@angular_common@5.2.11@@angular/common/http';


/*export class  HttpExport {
    public download(url:string, params?: any): Observable<any> {
        url = HOST + url;
        const headers = new HttpHeaders().set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        const responseType ='blob';
        let httpParams: HttpParams = new HttpParams();
        if (params) {
            for (const p in params) {
                if (params[p]) {
                    httpParams = httpParams.set(p, params[p]);
                }
            }
        }
        return this.http.get( url,{ 'headers': headers,'responseType': responseType,'params':httpParams })
            .map(res =>{
                return res;
            });
    }
}*/


