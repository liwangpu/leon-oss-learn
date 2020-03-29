import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from 'cloud-identity';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'cloud-core';
import { COOKIESTORAGE, ICookieStorage } from 'cloud-deed';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public returnUrl: string;
    public loginForm: FormGroup;
    public loginFailure: boolean = false;
    public loginFailureMessage: string;
    public constructor(
        @Inject(COOKIESTORAGE) private cookieStorageSrv: ICookieStorage,
        private formBuilder: FormBuilder,
        private tokenSrv: TokenService,
        private router: Router,
        private acr: ActivatedRoute
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['leon', [Validators.required]],
            password: ['123456', [Validators.required]],
            keepAlive: [false]
        });
        this.acr.queryParams.subscribe(params => this.returnUrl = params['return']);
    }

    public ngOnInit(): void {
    }

    public login(): void {
        let data = this.loginForm.value;
        this.tokenSrv.login(data.username, data.password).subscribe(res => {
            // this.localStorageSrv.setItem('token', res.access_token);
            // this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/app');
            let now: number = Date.now();
            // 十天免登录
            let dayMilliSecond: number = 1000 * 60 * 60 * 24;
            // uuid是token的凭证,主要是用来判断当前token/refresh token唯一标识信息而已,没有多大意义,存久一些也没有关系
            this.cookieStorageSrv.setItem('uuid', res.uuid, { expires: new Date(now + dayMilliSecond * 10) });
            // 免登录设置
            if (data.keepAlive) {
                this.cookieStorageSrv.setItem('token', res.access_token, { expires: new Date(now + dayMilliSecond) });
                this.cookieStorageSrv.setItem('refresh_token', res.refresh_token, { expires: new Date(now + dayMilliSecond * 10) });
            } else {
                this.cookieStorageSrv.setItem('token', res.access_token);
            }

            // 放50个主页路由历史,避免用户在登陆成功后不小心点击返回按钮,导致回到ids/logout路由导致退出而返回到登陆页面
            // 一般来讲,如果我们在登陆成功后,应该清除history信息,这样退回按钮就会因为没有历史而禁止退回按钮,但是浏览器是不允许我们自己私自清除的,所以才用这个小技巧
            for (let n: number = 0; n < 50; n++) {
                history.pushState(null, '', '/');
            }
            // 因为跳回到return url可能会切换用户登陆,所以可能会有没有页面的权限,目前先直接都跳回/,不然会跳回没有权限页面体验不好
            // tslint:disable-next-line: no-floating-promises
            this.router.navigateByUrl('/');
        });
    }
}
