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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TableComponent } from './components/table/table.component';
import { TableHeaderCellComponent } from './components/table-header-cell/table-header-cell.component';
import { ColumnFilterPanelComponent } from './components/column-filter-panel/column-filter-panel.component';
import { FilterItemBoxComponent } from './components/filter-item-box/filter-item-box.component';
import { FilterItemSettingPanelComponent } from './components/filter-item-setting-panel/filter-item-setting-panel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ColumnFilterViewEditPanelComponent } from './components/column-filter-view-edit-panel/column-filter-view-edit-panel.component';
import { ColumnVisualEditingPanelComponent } from './components/column-visual-editing-panel/column-visual-editing-panel.component';


@NgModule({
    declarations: [SortTableColumnDirective, ResizeTableColumnDirective, ColumResizerHandlerDirective, DynamicStyleWidthDirective, GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent, TableComponent, TableHeaderCellComponent, ColumnFilterPanelComponent, FilterItemBoxComponent, FilterItemSettingPanelComponent, ModalContainerComponent, ColumnFilterViewEditPanelComponent, ColumnVisualEditingPanelComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        DragDropModule,
        ScrollingModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatButtonModule,
        MatSidenavModule,
        MatDialogModule,
        MatMenuModule
    ],
    providers: [
        QueryParamTransformPolicyService,
    ],
    exports: [
        GridComponent
    ],
    entryComponents: [
        FilterItemSettingPanelComponent,
        ColumnFilterViewEditPanelComponent,
        ColumnVisualEditingPanelComponent
    ]
})
export class GridModule { }
