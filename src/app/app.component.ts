import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public constructor(
        @Inject(PLATFORM_ID) platformId: string,
        private translateSrv: TranslateService,
        private router: Router
    ) {

        if (isPlatformBrowser(platformId)) {
            let lastLanguage = 'zh';
            if (lastLanguage) {
                this.translateSrv.use(lastLanguage);
            }
            else {
                let broswerLang = this.translateSrv.getBrowserLang();
                broswerLang = broswerLang && broswerLang.match(/en|zh/) ? broswerLang : 'zh';
                this.translateSrv.use(broswerLang);
                // this.cacheSrv.lastLanguage = broswerLang;
            }
        }

        this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(res => {
            console.info('url info', res);
        });
    }
}
