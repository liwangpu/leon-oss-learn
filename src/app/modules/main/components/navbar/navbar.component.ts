import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { IAppNav, GetMapNav, GetMapNavs } from 'cloud-deed';
import { Subject, merge } from 'rxjs';
import { RouterRecorderService } from 'src/app/services/router-recorder.service';
import { takeUntil, delay, take, skip, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'main-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    public hideNavs = true;
    public minNavs = false;
    public latestNavs: IAppNav[] = [];
    @ViewChild('recentNavCt', { static: true })
    public recentNavCt: ElementRef;
    @HostListener('window:resize')
    public detectResize(): void {
        this.windowResize$.next();
    }
    private destroy$ = new Subject();
    private windowResize$ = new Subject();
    constructor(
        protected recorderSrv: RouterRecorderService
    ) {

    }//constructor

    ngOnInit() {
        //页面渲染结束后初始化导航栏
        this.recorderSrv.currentVisitedChange.pipe(takeUntil(this.destroy$), delay(500), take(1)).subscribe(url => {
            let nv = GetMapNav(url);

            if (!nv) return;
            this.judeCurrentNavMode(nv.url);
            let count = this.reCalcDisplayNavCount();
            this.latestNavs = GetMapNavs(this.recorderSrv.latestVisited.slice(0, count));
        });//subscribe
        //路由改变或者窗口大小改变时候,调整最近导航栏
        merge(this.recorderSrv.currentVisitedChange.pipe(skip(1)), this.windowResize$.pipe(debounceTime(500))).subscribe((url: string) => {
            if (url) {
                let nv = GetMapNav(url);
                if (nv) {
                    let exist = this.latestNavs.some(x => x.url == nv.url);
                    if (!exist) {
                        this.latestNavs.unshift(nv);
                    }
                }
                this.judeCurrentNavMode(nv ? nv.url : undefined);
            }//if

            let capacityCount = this.reCalcDisplayNavCount();
            let latestNavCount = this.latestNavs.length;
            if (latestNavCount > capacityCount) {
                this.latestNavs = this.latestNavs.slice(0, capacityCount);
            }
            else {
                let canAddNavCount = capacityCount - latestNavCount;
                for (let i = 0, len = this.recorderSrv.latestVisited.length; i < len; i++) {
                    if (canAddNavCount < 1) break;
                    let u = this.recorderSrv.latestVisited[i];
                    let nv = GetMapNav(u);
                    if (!nv) continue;
                    let exist = this.latestNavs.some(x => x.url == nv.url);
                    if (!exist) {
                        this.latestNavs.push(nv);
                        canAddNavCount--;
                    }
                }//for
            }//else

        })//subscribe
    }//ngOnInit

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    public toggleRencentNav() {
        this.minNavs = !this.minNavs;
    }

    public judeCurrentNavMode(url: string) {
        if (!url) {
            this.hideNavs = true;
            return;
        }
        let nav = GetMapNav(url);
        this.hideNavs = !(nav && nav.recentnav);
    }

    public reCalcDisplayNavCount() {
        let itemMinWh = 80;//一个nav的宽度
        let wh = this.recentNavCt.nativeElement.offsetWidth;
        let res = wh % itemMinWh;
        return (wh - res) / itemMinWh - 1;//比实际能容量的少一个,不然显得太挤
    }

}
