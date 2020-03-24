import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthenticationGuard, AuthorizationGuard } from 'cloud-core';

const routes: Routes = [
    {
        path: 'app',
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthorizationGuard],
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
    },
    { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
    { path: 'not-found', component: NotFoundComponent },
    { path: '', pathMatch: 'full', redirectTo: 'app' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
