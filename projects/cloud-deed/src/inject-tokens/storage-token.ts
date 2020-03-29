import { InjectionToken } from '@angular/core';

export interface ILocalStorage {
    setItem(key: string, value: any): void;
    getItem<T = null>(key: string): T;
    removeItem(key: string): void;
    clear(): void;
}

export interface ISessionStorage {
    setItem(key: string, value: any): void;
    getItem<T = null>(key: string): T;
    removeItem(key: string): void;
    clear(): void;
}

export interface ICookieStorage {
    setItem(key: string, value: any, options?: { path?: string; domain?: string; expires?: Date; maxAge?: number }): void;
    getItem(key: string): string;
    removeItem(key: string, options?: { path?: string; domain?: string; expires?: Date; maxAge?: number }): void;
}

export const LOCALSTORAGE: InjectionToken<ILocalStorage> = new InjectionToken<ILocalStorage>('local storage');
export const SESSIONSTORAGE: InjectionToken<ISessionStorage> = new InjectionToken<ISessionStorage>('session storage');

export const COOKIESTORAGE: InjectionToken<ICookieStorage> = new InjectionToken<ICookieStorage>('cookie storage');
