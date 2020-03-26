import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cloud-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {

    public activeFilterViewName: string = '全部';
    public enableFilterView: boolean = true;
    constructor() { }

    ngOnInit(): void {
    }

}
