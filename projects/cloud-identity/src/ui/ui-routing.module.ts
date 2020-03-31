import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { IdentityListComponent } from './components/identity-list/identity-list.component';
import { IdentityEditComponent } from './components/identity-edit/identity-edit.component';


const routes: Routes = [
    {
        path: 'profile/setting',
        component: ProfileSettingComponent
    },
    {
        path: 'identity',
        component: IdentityListComponent
    },
    {
        path: 'identity/edit',
        component: IdentityEditComponent
    },
    {
        path: 'identity/edit/:id',
        component: IdentityEditComponent
    },
    {
        path: 'organization',
        component: OrganizationListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UiRoutingModule { }
