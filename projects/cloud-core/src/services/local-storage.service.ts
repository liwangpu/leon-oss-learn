import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

const prefix: string = 'cloud';

@Injectable()
export class LocalStorageService  {

    private localStorageAvailable: boolean;
    public constructor(
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.localStorageAvailable = isPlatformBrowser(this.platformId);
    }

    public setItem(key: string, value: any): void {
        if (this.localStorageAvailable && key && value !== undefined) {
            localStorage.setItem(LocalStorageService.generateKey(key), JSON.stringify(value));
        }
    }

    public getItem<T = null>(key: string): T {
        if (!this.localStorageAvailable || !key) {
            return null;
        }

        const value: string = localStorage.getItem(`${prefix}-${key}`);
        try {
            if (value) {
                const getItem: T = JSON.parse(value) as T;
                if (getItem) {
                    return getItem;
                }
            }
        } catch (error) {
            console.error(`local storage 在解析"${key}"时出现异常,得到的值是:`, value);
        }
        return null;
    }

    public removeItem(key: string): void {
        if (!this.localStorageAvailable || !key) {
            return;
        }

        localStorage.removeItem(`${prefix}-${key}`);
    }

    public clear(): void {
        if (!this.localStorageAvailable) {
            return;
        }
        localStorage.clear();
    }

    public static generateKey(key: string): string {
        return `${prefix}-${key}`;
    }

}
