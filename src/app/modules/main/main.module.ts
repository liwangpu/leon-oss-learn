import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'cloud-core';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            // {
            //     path: 'ids',
            //     loadChildren: () => import('../../lazy-loaders/identity-loader.module').then(m => m.IdentityLoaderModule)
            // },
        ]
    }
];

@NgModule({
    declarations: [MainComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class MainModule { }
