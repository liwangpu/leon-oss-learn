import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cloud-shared-detail-viewer',
    templateUrl: './detail-viewer.component.html',
    styleUrls: ['./detail-viewer.component.scss']
})
export class DetailViewerComponent implements OnInit {

    @Input()
    public title: string;
    public icon: string;
    public constructor() { }

    public ngOnInit(): void {
    }

    public goBack(): void {

    }
}
