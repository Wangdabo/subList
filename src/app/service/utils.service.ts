import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions , Response , URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable()
export class UtilityService {
    constructor(private http: Http,
    private injector: Injector,
     private router: Router,
    ) { }
    /**
     * @param {string} url地址
     * @param {any} [options]可选提交的参数
     * @param {any} [header]可选设置的头信息
     * @memberof ServiceBaseService
     * @title: 封装一个get请求的基础类
     */

    // 跳转路由 原理 通过catch 拦截异常，然后在抛出一个新的错误
  public httpErrorFun(err: any) {  /* new */
     let data: any = err.json();  // 需要处理的值 /* new */
     if (data.code === 'AUTH-401') {
     this.router.navigateByUrl('/passport/login');
     }
    return Observable.throw(data); /* new */
   }


    getData(url: string, options?: any, myheaders?: any): Observable<any> {
        // 配置请求头
        const myHeaders: Headers = new Headers();


        for (const key in myheaders) {
            myHeaders.append(key, myheaders[key]);
        };

        url += (url.indexOf('?') < 0 ? '?' : '&') + this.param(options);
        return this.http.get(url, { headers: myHeaders })
        .catch(res => this.httpErrorFun(res))
        .map(res => res.json());
    }


    /**
     * @param url地址
     * @param options提交的数据
     * @param myheaders可选参数设置头
     * @title:封装一个post请求数据的
     */
    postData(url: string, options: any, myheaders?: any): Observable<any> {
        const myHeaders: Headers = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        for (const key in myheaders) {
            myHeaders.append(key, myheaders[key]);
        }
        return this.http.post(url, options, { headers: myHeaders })
        .catch(res => this.httpErrorFun(res))
        .map(res => res.json());

    }


    // put 修改测试封装
    putData(url: string, options?: any, myheaders?: any): Observable<any> {

        const myHeaders: Headers = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        for (const key in myheaders) {
            myHeaders.append(key, myheaders[key]);
        }
        return this.http.put(url, options, { headers: myHeaders })
         .catch(res => this.httpErrorFun(res))
        .map(res => res.json());;
    }

    // 删除封装
    deleatData(url: string, myheaders?: any): Observable<any> {

        const myHeaders: Headers = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        for (const key in myheaders) {
            myHeaders.append(key, myheaders[key]);
        }

        return  this.http.delete(url, { headers: myHeaders })
        .catch(res => this.httpErrorFun(res))
        .map(res => res.json());;

    }


    /**
     * @param {any} data
     * @returns
     * @memberof ServiceBaseService
     * @title:封装一个序列化get请求的参数的方法
     */
    param(data): string {
        let url = '';
        for (const k in data) {
            const value = data[k] !== undefined ? data[k] : '';
            url += `&${k}=${encodeURIComponent(value)}`;
        }
        return url ? url.substring(1) : '';
    }
}
