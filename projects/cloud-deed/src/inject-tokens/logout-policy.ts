import { InjectionToken } from '@angular/core';

export interface ILogoutPolicy {
    /**
 * 退出登陆
 */
    logout(): void;
}

export const LOGOUTPOLICY: InjectionToken<ILogoutPolicy> = new InjectionToken<ILogoutPolicy>('logout policy');