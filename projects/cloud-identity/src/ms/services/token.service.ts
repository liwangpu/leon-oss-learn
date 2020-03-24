import { Injectable, Inject } from '@angular/core';
import { APIGATEWAY } from 'cloud-deed';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIdentityToken } from '../models/i-identity-token';

@Injectable()
export class TokenService {

    private uri: string;
    public constructor(
        @Inject(APIGATEWAY) private apiGateway: string,
        private http: HttpClient
    ) {
        this.uri = `${this.apiGateway}/ids/connect/token`;
    }

    /**
     * 请求Token
     * @param username 用户名
     * @param password 密码(明文)
     */
    public login(username: string, password: string, captchaCode?: string): Observable<IIdentityToken> {
        const body: FormData = new FormData();
        body.set('grant_type', 'password');
        body.set('client_id', 'server');
        body.set('username', username);
        body.set('password', password);
        return this.http.post<IIdentityToken>(this.uri, body);
    }

    /**
     * 根据unionId请求Token
     * @param unionId unionId
     */
    public loginByWeChatUnionId(unionId: string): Observable<IIdentityToken> {
        const body: FormData = new FormData();
        body.set('grant_type', 'wetchatUniqueId');
        body.set('client_id', 'server');
        body.set('uniqueId', unionId);
        return this.http.post<IIdentityToken>(this.uri, body);
    }

    /**
     * 根据refresh token获取新的token
     * @param refreshToken refresh token
     */
    public refreshToken(refreshToken: string): Observable<IIdentityToken> {
        const body: FormData = new FormData();
        body.set('grant_type', 'refresh_token');
        body.set('client_id', 'server');
        body.set('refresh_token', refreshToken);
        return this.http.post<IIdentityToken>(this.uri, body);
    }

}
