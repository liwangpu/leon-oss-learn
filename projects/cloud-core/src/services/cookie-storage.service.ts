import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { COOKIEPERMITDOMAINTOKEN, ICookieStorage, UrlTool } from 'cloud-deed';

@Injectable()
export class CookieStorageService implements ICookieStorage {
    private cookieStorageAvailable: boolean;
    public constructor(
        @Optional() @Inject(COOKIEPERMITDOMAINTOKEN) private defaultPermitDomain: string,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.cookieStorageAvailable = isPlatformBrowser(this.platformId);
    }

    public setItem(key: string, value: any, options: { path?: string; domain?: string; expires?: Date; maxAge?: number } = {}): void {
        if (!this.cookieStorageAvailable || !key) {
            return;
        }

        options.path = options.path ? options.path : '/';

        if (options.maxAge !== undefined) {
            options['max-age'] = options.maxAge;
        }

        if (!options.domain) {
            // tslint:disable-next-line: prefer-conditional-expression
            if (this.defaultPermitDomain) {
                options.domain = this.defaultPermitDomain;
            } else {
                options.domain = UrlTool.getTLD();
            }
        }

        let updatedCookie: string = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

        // tslint:disable-next-line: forin
        for (let optionKey in options) {
            updatedCookie += '; ' + optionKey;
            let optionValue: any = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += `=${optionValue}`;
            }
        }

        document.cookie = updatedCookie;
    }

    public getItem(key: string): string {
        if (!this.cookieStorageAvailable || !key) {
            return undefined;
        }

        let matches: any = document.cookie.match(new RegExp(
            // tslint:disable-next-line: prefer-template
            '(?:^|; )' + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    public removeItem(key: string, options: { path?: string; domain?: string; expires?: Date; maxAge?: number } = {}): void {
        options.path = options.path ? options.path : '/';
        options.maxAge = -1;
        this.setItem(key, '', options);
    }
}
