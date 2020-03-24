import { InjectionToken } from '@angular/core';

/**
 *  授权策略
 */
export interface IAuthorizationPolicy {

    /**
     * 验证是否有访问权限
     * @param permisstionKey 权限点
     */
    authorize(permisstionKey?: string): Promise<boolean>;
    /**
     * 验证失败后路由跳转
     */
    unAuthorizedRoutingHop(): void;
}

export const AUTHORIZATIONPOLICY: InjectionToken<IAuthorizationPolicy> = new InjectionToken<IAuthorizationPolicy>('authorization policy');
