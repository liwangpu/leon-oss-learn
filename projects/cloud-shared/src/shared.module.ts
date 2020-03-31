import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewerComponent } from './components/list-viewer/list-viewer.component';
import { GridModule } from 'cloud-grid';
import { TranslateModule } from '@ngx-translate/core';
import { DetailViewerComponent } from './components/detail-viewer/detail-viewer.component';


@NgModule({
    declarations: [ListViewerComponent, DetailViewerComponent],
    imports: [
        CommonModule,
        GridModule,
        TranslateModule
    ],
    exports: [
        ListViewerComponent,
        DetailViewerComponent
    ]
})
export class SharedModule { }
