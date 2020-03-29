import { Injectable, Inject } from '@angular/core';
import { IAuthenticationPolicy, COOKIESTORAGE, ICookieStorage } from 'cloud-deed';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationPolicyService implements IAuthenticationPolicy {

    public constructor(
        @Inject(COOKIESTORAGE) private cookieStorageSrv: ICookieStorage,
        private router: Router,
    ) {

    }

    public authenticate(): Promise<boolean> {
        const token: string = this.cookieStorageSrv.getItem('token');
        return Promise.resolve(token ? true : false);
        // return Promise.resolve(true);
    }

    public unAuthenticatedRoutingHop(): void {
        this.router.navigateByUrl('/login');
    }
}
