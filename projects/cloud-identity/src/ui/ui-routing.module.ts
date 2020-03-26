import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';


const routes: Routes = [
    {
        path: 'profile-setting',
        component: ProfileSettingComponent
    },
    {
        path: 'organization-list',
        component: OrganizationListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UiRoutingModule { }
