import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewerComponent } from './components/list-viewer/list-viewer.component';
import { GridModule } from 'cloud-grid';


@NgModule({
    declarations: [ListViewerComponent],
    imports: [
        CommonModule,
        GridModule
    ],
    exports: [
        ListViewerComponent
    ]
})
export class SharedModule { }
