import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockErrorInterceptorMiddlewareService } from '../middlewares/mock-error-interceptor-middleware.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

    public constructor(
        private errorInterceptorMiddleware: MockErrorInterceptorMiddlewareService
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.errorInterceptorMiddleware.intercept(req, next);
        // return next.handle(req);
    }

}
