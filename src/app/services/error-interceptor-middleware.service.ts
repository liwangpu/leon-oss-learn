import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptorMiddlewareService {

    public constructor(
        private injector: Injector
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return next.handle(req).pipe(catchError(response => {

        //     if (response.error && response.error.message) {
        //         this.operationMessageSrv.error(response.error.message.length >= 300 ? response.error.message.slice(0, 300) : response.error.message);
        //     }

        //     let clearStorageAndReload: Function = () => {
        //         this.cookieStorageSrv.removeItem('token');
        //         this.cookieStorageSrv.removeItem('refresh_token');
        //         location.reload();
        //     };

        //     // token失效,使用refresh token请求新的token,这里不做跳转设置
        //     if (response.status === 401 && typeof location !== 'undefined') {
        //         let tokenSrv: TokenService = this.injector.get(TokenService);
        //         let refreshToken: string = this.cookieStorageSrv.getItem('refresh_token');
        //         if (refreshToken) {
        //             return tokenSrv.refreshToken(refreshToken)
        //                 .pipe(tap(tok => {
        //                     this.cookieStorageSrv.setItem('token', tok.access_token);
        //                     this.cookieStorageSrv.setItem('token_expires_in', tok.expires_in);
        //                     this.cookieStorageSrv.setItem('refresh_token', tok.refresh_token);
        //                 }))
        //                 .pipe(catchError(err => {
        //                     // 如果用refresh token请求都失败,那就就是refresh token过期了
        //                     clearStorageAndReload();
        //                     return of(null);
        //                 }))
        //                 .pipe(switchMap(() => {
        //                     let token: string = this.cookieStorageSrv.getItem('token');
        //                     let secureHeaders: any = req.headers;
        //                     secureHeaders = secureHeaders.delete('Authorization');
        //                     secureHeaders = secureHeaders.append('Authorization', `bearer ${token}`);
        //                     const secureReq: any = req.clone({ headers: secureHeaders });
        //                     return next.handle(secureReq);
        //                 }));
        //         } else {
        //             clearStorageAndReload();
        //         }
        //     }
        //     return throwError(response);
        // }));

        return next.handle(req);
    }
}
