/**
 * @author gyjlovelh
 * @createTime 2017/10/8
 */
import { Injectable, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    constructor(
        private $router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, // 依赖注入 注入token
    ) {}
    /**
     * 拦截器  给请求设置 authorization 的头
     * @param {HttpRequest<any>} req
     * @param {HttpHandler} next
     * @description
     * @returns {Observable<HttpEvent<any>>}
     */

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // 拦截请求
        const token = 'css'; // 绑定token
        let authReq = null;
        if (token) {
            authReq = req.clone({ setHeaders: { 'asdd': token}});
        }

        return next.handle(authReq || req).map(event => {
              console.log(event);
            // 拦截响应
            if (event instanceof HttpResponse) {
                if (event.status === 401) {
                    this.$router.navigate(['']).then(() => {});
                }
            }
            return event;
        });
    }


}
