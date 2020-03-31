import { Injectable, Inject } from '@angular/core';
import { ILogoutPolicy, LOGOUTPOLICY, COOKIESTORAGE, ICookieStorage } from 'cloud-deed';
import { Router } from '@angular/router';

@Injectable()
export class LogoutPolicyService implements ILogoutPolicy {

    public constructor(
        @Inject(COOKIESTORAGE) private cookieStorageSrv: ICookieStorage,
        private router: Router
    ) { }

    public logout(): void {
        this.cookieStorageSrv.removeItem('token');
        this.cookieStorageSrv.removeItem('refresh_token');
        this.cookieStorageSrv.removeItem('uuid');
        this.router.navigateByUrl('/login');
    }

}
