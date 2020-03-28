import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { RouterRecorderService } from './services/router-recorder.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public constructor(
        @Inject(PLATFORM_ID) platformId: string,
        private translateSrv: TranslateService,
        private router: Router,
        private routerRecorderSrv: RouterRecorderService
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
      //记录最近访问的路由信息
      this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).pipe(map(evt => evt['url'])).subscribe(url => this.routerRecorderSrv.recordUrl(url));

        this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(res => {
            console.info('url info', res);
        });
    }
}
