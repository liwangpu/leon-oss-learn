import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard, AuthorizationGuard } from 'cloud-core';

const routes: Routes = [
    {
        path: 'app',
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthorizationGuard],
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
    },
    { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
    { path: 'not-found', loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: '', pathMatch: 'full', redirectTo: 'app' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
