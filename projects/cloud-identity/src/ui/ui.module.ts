import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiRoutingModule } from './ui-routing.module';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { SharedModule } from 'cloud-shared';
import { IdentityListComponent } from './components/identity-list/identity-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityEditComponent } from './components/identity-edit/identity-edit.component';

@NgModule({
    declarations: [ProfileSettingComponent, OrganizationListComponent, IdentityListComponent, IdentityEditComponent],
    imports: [
        CommonModule,
        UiRoutingModule,
        TranslateModule,
        SharedModule
    ]
})
export class UiModule { }
