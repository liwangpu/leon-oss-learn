import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IErrorInterceptorMiddleware {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export const ERRORINTERCEPTORMIDDLEWARE: InjectionToken<IErrorInterceptorMiddleware> = new InjectionToken<IErrorInterceptorMiddleware>('error interceptor middleware');
