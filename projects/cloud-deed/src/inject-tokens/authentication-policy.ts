import { InjectionToken } from '@angular/core';

/**
 *  认证策略
 */
export interface IAuthenticationPolicy {
    /**
     * 验证是否有访问权限
     */
    authenticate(): Promise<boolean>;
    /**
     * 验证失败后路由跳转
     */
    unAuthenticatedRoutingHop(): void;
}

export const AUTHENTICATIONPOLICY: InjectionToken<IAuthenticationPolicy> = new InjectionToken<IAuthenticationPolicy>('authentication policy');