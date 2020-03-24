import { Injectable } from '@angular/core';
import { IAuthorizationPolicy } from 'cloud-deed';

@Injectable()
export class AuthorizationPolicyService implements IAuthorizationPolicy {

    public constructor() { }

    public authorize(permisstionKey?: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public unAuthorizedRoutingHop(): void {

    }
}
