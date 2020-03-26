import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumResizerHandlerDirective } from './directives/colum-resizer-handler.directive';
import { DynamicStyleWidthDirective } from './directives/dynamic-style-width.directive';
import { ResizeTableColumnDirective } from './directives/resize-table-column.directive';
import { SortTableColumnDirective } from './directives/sort-table-column.directive';
import { QueryParamTransformPolicyService } from './services/query-param-transform-policy.service';
import { GridComponent } from './components/grid/grid.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { GridContentComponent } from './components/grid-content/grid-content.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    declarations: [SortTableColumnDirective, ResizeTableColumnDirective, ColumResizerHandlerDirective, GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent,],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        DragDropModule,
        ScrollingModule,
        MatIconModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule
    ],
    providers: [
        QueryParamTransformPolicyService,
    ],
    exports: [
        GridComponent
    ],
    entryComponents: [
    ]
})
export class GridModule { }
