import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LauncherComponent } from '../launcher/launcher.component';

@Component({
    selector: 'main-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    public accountName = "User";
    public constructor(
        protected dialogSrv: MatDialog
    ) { }

    public ngOnInit(): void {
    }

    public openLauncher(): void {
        this.dialogSrv.open(LauncherComponent, { width: '900px', height: '750px' });
    }

    public logout(): void {

    }

}
