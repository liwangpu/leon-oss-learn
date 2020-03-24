import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CoreModule as CloudCoreModule } from 'cloud-core';
import { AuthenticationPolicyService } from './services/authentication-policy.service';
import { AuthorizationPolicyService } from './services/authorization-policy.service';
import { AUTHENTICATIONPOLICY, AUTHORIZATIONPOLICY, APIGATEWAY } from 'cloud-deed';
import { MsModule as IdentityMsModule } from 'cloud-identity';
import { AppConfigService } from './services/app-config.service';
import { HttpClientModule } from '@angular/common/http';

const appInitializerFn: Function = (appConfig: AppConfigService) =>
    () => appConfig.loadAppConfig();

const appApiGatewayFn: Function = (configSrv: AppConfigService) => configSrv.appConfig ? configSrv.appConfig.apiGateway : 'apiGateway-not-inititalize';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CloudCoreModule.forRoot(),
        IdentityMsModule.forRoot()
    ],
    providers: [
        AppConfigService,
        AuthenticationPolicyService,
        AuthorizationPolicyService,
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
        { provide: AUTHENTICATIONPOLICY, useExisting: AuthenticationPolicyService },
        { provide: AUTHORIZATIONPOLICY, useExisting: AuthorizationPolicyService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
