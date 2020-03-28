import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

/**
 * 记录最近访问路由信息,仅记录最近30个
 * 不记录查询参数,否则太多了
 * 虽然改服务用为全局,但是基本就是为了feature/main模块使用,所以其他模块应该不使用这个服务
 */
@Injectable()
export class RouterRecorderService {

    private _currentVisitedChange = new BehaviorSubject<string>(null);
    latestVisited: Array<string> = [];//这个是不包含查询参数的
    currentVisitedChange = this._currentVisitedChange.asObservable();
    constructor(protected router: Router) {
    }

    recordUrl(url: string) {
        // //原始的记录最近访问的路径
        // this.locationHistories.unshift(url);
        // let hLen = this.locationHistories.length;
        // this.locationHistories = this.locationHistories.slice(0, 3);
        //接着处理应用程序app启动url
        url = url.toLocaleLowerCase();
        let main = url.indexOf("?") > -1 ? url.split('?')[0] : url;

        // //不记录主页
        // if (url == '/' || url == '/app') {
        //   return;
        // }

        for (let i = 0, len = this.latestVisited.length; i < len; i++) {
            let it = this.latestVisited[i];
            if (it == main) {
                this.latestVisited[i] = undefined;
                break;
            }
        }//for

        this.latestVisited.unshift(main);
        this.latestVisited = this.latestVisited.filter(x => x);
        this.latestVisited = this.latestVisited.splice(0, 30);
        this._currentVisitedChange.next(main);
    }

}
