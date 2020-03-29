import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthenticationInterceptorMiddleware } from 'cloud-deed';

@Injectable()
export class MockAuthenticationInterceptorMiddlewareService implements IAuthenticationInterceptorMiddleware {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        throw new Error('哦吼,你不应该用我作为实例,请在trank层注入服务指定新的');
    }

}
