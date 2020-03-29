import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockAuthenticationInterceptorMiddlewareService } from '../middlewares/mock-authentication-interceptor-middleware.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    public constructor(
        private authInterceptorMiddleware: MockAuthenticationInterceptorMiddlewareService
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log(111, this.authInterceptorMiddleware, typeof this.authInterceptorMiddleware);
        return this.authInterceptorMiddleware.intercept(req, next);

        // return next.handle(req);
    }
}
