import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { isDevMode } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppConfigService {

    public appConfig: any;
    public constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private injector: Injector
    ) {

    }

    public async loadAppConfig(): Promise<void> {

        const browserMode: boolean = isPlatformBrowser(this.platformId);
        if (browserMode) {
            const http: HttpClient = this.injector.get(HttpClient);
            const configFile: string = isDevMode() ? '/assets/app-config.dev.json' : '/assets/app-config.json';
            return http.get(configFile).pipe(tap((data: any) => {
                this.appConfig = data;
            })).toPromise();
        }

        return Promise.resolve();
    }
}
