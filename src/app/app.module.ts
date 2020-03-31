import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { CoreModule as CloudCoreModule, AuthInterceptorService, ErrorInterceptorService, MockAuthenticationInterceptorMiddlewareService, AuthenticationInterceptorMiddlewareService, MockErrorInterceptorMiddlewareService, CookieStorageService, LocalStorageService } from 'cloud-core';
import { AuthenticationPolicyService } from './services/authentication-policy.service';
import { AuthorizationPolicyService } from './services/authorization-policy.service';
import { AUTHENTICATIONPOLICY, AUTHORIZATIONPOLICY, APIGATEWAY, COOKIESTORAGE, LOCALSTORAGE, LOGOUTPOLICY } from 'cloud-deed';
import { MsModule as IdentityMsModule } from 'cloud-identity';
import { AppConfigService } from './services/app-config.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { LocalizationInterceptorService } from './services/localization-interceptor.service';
import { GRIDCONFIG, QUERYPARAMTRANSFORMPOLICY } from 'cloud-grid';
import { QueryParamTransformPolicyService } from './services/query-param-transform-policy.service';
import { CubeApiQueryParamTransformPolicyService } from './services/cube-api-query-param-transform-policy.service';
import { RouterRecorderService } from './services/router-recorder.service';
import { ErrorInterceptorMiddlewareService } from './services/error-interceptor-middleware.service';
import { LogoutPolicyService } from './services/logout-policy.service';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LocalizationInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: "./assets/i18n/", suffix: ".json" }
    ]);
}

const appInitializerFn: Function = (appConfig: AppConfigService) =>
    () => appConfig.loadAppConfig();

const appApiGatewayFn: Function = (configSrv: AppConfigService) => configSrv.appConfig ? configSrv.appConfig.apiGateway : 'apiGateway-not-inititalize';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        CloudCoreModule.forRoot(),
        IdentityMsModule.forRoot()
    ],
    providers: [
        AppConfigService,
        RouterRecorderService,
        AuthenticationPolicyService,
        AuthorizationPolicyService,
        ErrorInterceptorMiddlewareService,
        QueryParamTransformPolicyService,
        CubeApiQueryParamTransformPolicyService,
        LogoutPolicyService,
        httpInterceptorProviders,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [AppConfigService]
        },
        {
            provide: APIGATEWAY,
            useFactory: appApiGatewayFn,
            deps: [AppConfigService]
        },
        {
            provide: GRIDCONFIG,
            useValue: {
                rowsPerPageOptions: [20, 50, 100]
            }
        },
        {
            provide: QUERYPARAMTRANSFORMPOLICY,
            useExisting: QueryParamTransformPolicyService
        },
        { provide: COOKIESTORAGE, useExisting: CookieStorageService },
        { provide: LOCALSTORAGE, useExisting: LocalStorageService },
        { provide: LOGOUTPOLICY, useExisting: LogoutPolicyService },
        { provide: MockAuthenticationInterceptorMiddlewareService, useExisting: AuthenticationInterceptorMiddlewareService },
        { provide: MockErrorInterceptorMiddlewareService, useExisting: ErrorInterceptorMiddlewareService },
        { provide: AUTHENTICATIONPOLICY, useExisting: AuthenticationPolicyService },
        { provide: AUTHORIZATIONPOLICY, useExisting: AuthorizationPolicyService },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
