import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAuthenticationInterceptorMiddleware {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export const AUTHEHNTICATIONINTERCEPTORMIDDLEWARE: InjectionToken<IAuthenticationInterceptorMiddleware> = new InjectionToken<IAuthenticationInterceptorMiddleware>('authentication interceptor middleware');
