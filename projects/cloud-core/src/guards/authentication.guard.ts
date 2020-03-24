import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTHENTICATIONPOLICY, IAuthenticationPolicy } from 'cloud-deed';


@Injectable()
export class AuthenticationGuard implements CanActivate {

    private browserMode: boolean = false;
    public constructor(
        @Inject(AUTHENTICATIONPOLICY) private authenticationPolicy: IAuthenticationPolicy,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.browserMode = isPlatformBrowser(this.platformId);
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const redirect: (valid: boolean) => boolean = (valid: boolean) => {
            // angular ssr模式,让页面预渲染,把认证细节推迟到浏览器
            if (!this.browserMode) {
                return true;
            } else {
                if (!valid) {
                    this.authenticationPolicy.unAuthenticatedRoutingHop();
                }
            }
            return valid;
        };
        return this.authenticationPolicy.authenticate().then(redirect);
    }

}
