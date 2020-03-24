import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { TokenService } from './services/token.service';

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
                TokenService
            ]
        };
    }
 }
