import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiRoutingModule } from './ui-routing.module';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';

@NgModule({
    declarations: [ProfileSettingComponent, OrganizationListComponent],
    imports: [
        CommonModule,
        UiRoutingModule
    ]
})
export class UiModule { }
