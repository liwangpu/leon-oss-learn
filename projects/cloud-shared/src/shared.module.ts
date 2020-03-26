import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewerComponent } from './components/list-viewer/list-viewer.component';


@NgModule({
    declarations: [ListViewerComponent],
    imports: [
        CommonModule
    ],
    exports: [
        ListViewerComponent
    ]
})
export class SharedModule { }
