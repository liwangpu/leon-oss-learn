import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { TokenService } from './services/token.service';
import { OrganizationService } from './services/organization.service';
import { IdentityService } from './services/identity.service';

@NgModule()
export class MsModule {

    public constructor(@Optional() @SkipSelf() parentModule: MsModule) {
        if (parentModule) {
            throw new Error('trank模块使用forRoot()引用,其他模块不需要再引用了!');
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: MsModule,
            providers: [
                TokenService,
                OrganizationService,
                IdentityService
            ]
        };
    }
 }
