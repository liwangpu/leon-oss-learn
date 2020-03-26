import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'cloud-core';
import { PageComponent } from './components/page/page.component';
import { LauncherComponent } from './components/launcher/launcher.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UiModule } from 'cloud-identity';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'ids',
                loadChildren: () => import('../domain-loaders/identity-loader.module').then(m => m.IdentityLoaderModule)
            },
        ]
    }
];

@NgModule({
    declarations: [PageComponent, LauncherComponent, ToolbarComponent, NavbarComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule
    ],
    entryComponents: [
        LauncherComponent
    ]
})
export class MainModule { }
