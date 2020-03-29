import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthenticationInterceptorMiddleware, COOKIESTORAGE, ICookieStorage } from 'cloud-deed';

@Injectable()
export class AuthenticationInterceptorMiddlewareService implements IAuthenticationInterceptorMiddleware {

    public constructor(
        @Inject(COOKIESTORAGE) private cookieStorageSrv: ICookieStorage,
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: string = this.cookieStorageSrv.getItem('token');
        // console.log('token',token);
        if (token) {
            let secureHeaders: any = req.headers;
            secureHeaders = secureHeaders.append('Authorization', `bearer ${token}`);
            const secureReq: any = req.clone({ headers: secureHeaders });
            return next.handle(secureReq);
        }
        return next.handle(req);
    }
}
