import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from 'cloud-identity';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'cloud-core';

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
        private formBuilder: FormBuilder,
        private tokenSrv: TokenService,
        private localStorageSrv: LocalStorageService,
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
            this.localStorageSrv.setItem('token', res.access_token);
            console.log(222, this.returnUrl ? this.returnUrl : '/app');
            this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/app');
        });
    }
}
