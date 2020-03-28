import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { IFilterView } from '../../models/i-filter-view';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { filter, map, take } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { ObjectTool } from '../../utils/object-tool';
import { ArrayTool } from '../../utils/array-tool';
import { ITableColumn } from '../../models/i-table-column';
import { IFilter } from '../../models/i-filter';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { FilterItemBoxComponent } from '../filter-item-box/filter-item-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ColumnFilterViewEditPanelComponent } from '../column-filter-view-edit-panel/column-filter-view-edit-panel.component';

@Component({
    selector: 'cloud-grid-column-filter-panel',
    templateUrl: './column-filter-panel.component.html',
    styleUrls: ['./column-filter-panel.component.scss']
})
export class ColumnFilterPanelComponent implements OnInit {

    @ViewChild('filterItemsContainer', { static: true, read: ViewContainerRef }) public filterItemsContainer: ViewContainerRef;
    public enableFilterView: boolean = false;
    public filterView: IFilterView;
    public filterItemBoxs: Array<FilterItemBoxComponent>;
    public constructor(
        private cfr: ComponentFactoryResolver,
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private dialogService: MatDialog
    ) { }

    public ngOnInit(): void {
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ViewDefinition))
            .pipe(map(x => x.data))
            .subscribe(() => {
                this.filterView = ObjectTool.deepCopy(this.cache.activeFilterView);
                this.renderFilterPanel();
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.EnableFilterView))
            .pipe(map(x => x.data))
            .subscribe(enable => this.enableFilterView = enable);
    }

    public renderFilterPanel(): void {
        this.filterItemsContainer.clear();
        this.filterItemBoxs = [];
        if (this.filterView.filters && this.filterView.filters.length > 0) {
            for (let it of this.filterView.filters) {
                this.addFilterItem(it.field, it.operator, it.value);
            }
        }
    }

    public addFilterItem(field?: string, operator?: string, value?: string): void {
        let factory: ComponentFactory<FilterItemBoxComponent> = this.cfr.resolveComponentFactory(FilterItemBoxComponent);
        let com: ComponentRef<FilterItemBoxComponent> = this.filterItemsContainer.createComponent(factory);
        com.instance.id = `${Date.now()}-${field}`;
        com.instance.field = field;
        com.instance.operator = operator;
        com.instance.value = value;
        com.instance.generateDisplayMessage();
        com.instance.delete.pipe(take(1)).subscribe(id => {
            const i: number = this.filterItemBoxs.findIndex(x => x.id === id);
            if (i === -1) { return; }
            ArrayTool.remove(this.filterItemBoxs, it => it.id === id);
            this.filterItemsContainer.remove(i);
        });
        this.filterItemBoxs.push(com.instance);
    }

    public clearFilterItems(): void {
        this.filterItemsContainer.clear();
        this.filterItemBoxs = [];

        if (!this.enableFilterView) {
            this.query();
        }
    }

    public save(): void {
        let view: IFilterView = ObjectTool.deepCopy(this.filterView);
        if (view.id === '_ALL') {
            view.id = null;
            view.name = undefined;
        }

        view.filters = this.filterItemBoxs.filter(x => x.field).map(x =>
            ({
                field: x.field,
                operator: x.operator,
                value: x.value
            }));
        this.transformFilterValueType(view);

        const ref = this.dialogService.open(ColumnFilterViewEditPanelComponent, {
            // header: '保存新列表视图',
            width: '400px',
            height: '300px',
            data: view
        });

        ref.afterClosed()
            .pipe(filter(updateView => updateView))
            .subscribe(v => {
                this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, v);
            });
    }

    public query(): void {
        let view: IFilterView = ObjectTool.deepCopy(this.filterView);
        view.filters = this.filterItemBoxs.filter(x => x.field).map(x =>
            ({
                field: x.field,
                operator: x.operator,
                value: x.value
            }));
        this.transformFilterValueType(view);
        this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
    }

    private transformFilterValueType(view: IFilterView): void {
        if (!view.filters && view.filters.length < 1) {
            return;
        }
        const cols: Array<ITableColumn> = this.cache.columns;
        for (let idx: number = view.filters.length - 1; idx >= 0; idx--) {
            // tslint:disable-next-line: no-shadowed-variable
            let filter: IFilter = view.filters[idx];
            let col: ITableColumn = cols.filter(x => x.field === filter.field)[0];
            if (col) {
                // tslint:disable-next-line: prefer-switch
                if (col.fieldType === ColumnTypeEnum.Integer || col.fieldType === ColumnTypeEnum.Decimal) {
                    filter.value = Number(filter.value);
                } else if (col.fieldType === ColumnTypeEnum.Select) {
                    if (this.cache.fieldInfos && this.cache.fieldInfos[col.field]) {
                        let t: string = typeof (this.cache.fieldInfos[col.field][0].value);
                        // tslint:disable-next-line: prefer-conditional-expression
                        if (t === 'number') {
                            filter.value = Number(filter.value);
                        } else {
                            filter.value = `${filter.value}`;
                        }
                    } else {
                        filter.value = `${filter.value}`;
                    }
                } else {
                    filter.value = `${filter.value}`;
                }
            }
        }
    }


}
