import { Injectable } from '@angular/core';
import { IAuthenticationPolicy } from 'cloud-deed';
import { Router } from '@angular/router';
import { LocalStorageService } from 'cloud-core';

@Injectable()
export class AuthenticationPolicyService implements IAuthenticationPolicy {

    public constructor(
        private router: Router,
        private localStorageSrv: LocalStorageService
    ) {

    }

    public authenticate(): Promise<boolean> {
        let hasToken = this.localStorageSrv.getItem('token');
        // return Promise.resolve(hasToken ? true : false);
        return Promise.resolve(true);
    }

    public unAuthenticatedRoutingHop(): void {
        this.router.navigateByUrl('/login');
    }
}
