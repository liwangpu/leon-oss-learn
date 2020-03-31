import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LauncherComponent } from '../launcher/launcher.component';
import { COOKIESTORAGE, ICookieStorage, LOGOUTPOLICY, ILogoutPolicy } from 'cloud-deed';

@Component({
    selector: 'main-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    public accountName = "User";
    public constructor(
        @Inject(LOGOUTPOLICY) private logoutPolicy: ILogoutPolicy,
        protected dialogSrv: MatDialog
    ) { }

    public ngOnInit(): void {
    }

    public openLauncher(): void {
        this.dialogSrv.open(LauncherComponent, { width: '800px', height: '650px' });
    }

    public logout(): void {
        this.logoutPolicy.logout();
    }

}
