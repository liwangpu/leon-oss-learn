import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { LocalStorageService } from './services/local-storage.service';


@NgModule()
export class CoreModule {

    public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('根模块使用forRoot()引用,其他模块不需要再引用了!');
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                AuthenticationGuard,
                AuthorizationGuard,
                LocalStorageService
            ]
        };
    }
}
