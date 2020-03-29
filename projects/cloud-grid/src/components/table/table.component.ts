import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, Renderer2, SimpleChanges } from '@angular/core';
import { ITableColumn } from '../../models/i-table-column';
import { SortTableColumnDirective } from '../../directives/sort-table-column.directive';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { ArrayTool } from '../../utils/array-tool';
import { filter, take, delay } from 'rxjs/operators';
import { ISortEvent } from '../../models/i-sort-event';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'cloud-grid-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    @Input() public tableType: 'frozen' | 'unfrozen' = 'unfrozen';
    @Input() public columns: Array<ITableColumn> = [];
    @Input() public datas: Array<any> = [];
    @Input() public enableColumnFrozen: boolean = true;
    @Input() public selectMode: 'single' | 'multiple';
    @Output() public readonly afterResize: EventEmitter<void> = new EventEmitter<void>();
    @ViewChildren(SortTableColumnDirective) public sortColumns: QueryList<SortTableColumnDirective>;
    @ViewChildren('headerCell') public headerCells: QueryList<ElementRef>;
    @ViewChild('table', { static: false, read: ElementRef }) public table: ElementRef;
    public enableRowOperation: boolean;
    public currentEditColumn: ITableColumn;
    public radioSelected: string;
    public allRowSelected: boolean = false;
    public someRowSelected: boolean = false;
    public enableNORow: boolean = false;
    public constructor(
        private renderer2: Renderer2,
        private opsat: GridOpsatService,
        private cache: GridDataService
    ) {

    }
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas']) {
            this.allRowSelected = false;
            this.someRowSelected = false;
            this.radioSelected = null;
        }
    }

    public ngOnInit(): void {
        // 订阅取消冻结或者隐藏表格列事件,取消表格所占宽度
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.UnFreezeColumn))
            .subscribe(() => {
                this.renderer2.removeStyle(this.table.nativeElement, 'width');
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.EnableRowOperation))
            .pipe(take(1))
            .subscribe(() => this.enableRowOperation = true);

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ViewDefinition))
            .pipe(delay(100))
            .subscribe(() => {
                let cols: Array<ITableColumn> = this.cache.columns.filter(x => !x['invisibale']
                    && (this.tableType === 'unfrozen' ? !x['frozen'] : x['frozen']));
                let minWidth: number = 0;
                for (let col of cols) {
                    minWidth += col.width ? col.width : 0;
                }
                if (minWidth > 0) {
                    this.renderer2.setStyle(this.table.nativeElement, 'width', `${minWidth}px`);
                } else {
                    this.renderer2.removeStyle(this.table.nativeElement, 'width');
                }

                // 冻结列判断,用于判断是否显示选择框和序号
                const hasFrozenColumn = this.cache.columns.some(x => x['frozen']);
                if (this.tableType === 'frozen') {
                    this.enableNORow = hasFrozenColumn;
                }

                if (this.tableType === 'unfrozen') {
                    this.enableNORow = !hasFrozenColumn;
                }


            });
    }

    public editRow(row: any): void {
        this.opsat.publish(GridTopicEnum.RowOperating, {
            operation: 'edit',
            data: row
        });
    }

    public onSort(sort: ISortEvent): void {
        // 先清除其他排序列
        this.clearSort(sort.field);
        if (sort.direction === '') {
            this.cache.history.sorting.field = undefined;
            this.cache.history.sorting.direction = undefined;
        } else {
            this.cache.history.sorting.field = sort.field;
            this.cache.history.sorting.direction = sort.direction;
        }
        this.cache.history.pagination.page = 1;
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public afterColumnResize(): void {
        this.afterResize.next();
    }

    public calculateColumnWidth(): { [key: string]: number } {
        let obj: any = {};
        let index: number = 0;
        this.headerCells.forEach(it => {
            const rect: any = it.nativeElement.getBoundingClientRect();
            obj[this.columns[index].field] = rect.width;
            index++;
        });

        return obj;
    }

    public onLinkFieldClick(field: string, data: any, link?: any): void {
        if (!link) { return; }
        this.opsat.publish(GridTopicEnum.LinkFieldClick, { field, data });
    }

    public onRowClick(data: any): void {
        // if (!this.selectMode) { return; }
        // this.radioSelected = data['_id'];

        // if (this.selectMode === 'single') {
        //     this.opsat.publish(GridTopicEnum.RowSelected, [data]);
        // } else {
        //     data['selected'] = !data['selected'];
        //     this.allRowSelected = !this.datas.some(x => !x['selected']);
        //     this.opsat.publish(GridTopicEnum.RowSelected, this.datas.filter(x => x['selected']));
        // }
        // console.log('row click', this.datas.filter(x => x['selected']));
    }

    public selectAllRows(evt: MatCheckboxChange): void {
        this.allRowSelected = evt.checked;
        for (let it of this.datas) {
            it['selected'] = this.allRowSelected;
        }
        this.opsat.publish(GridTopicEnum.RowSelected, this.datas.filter(x => x['selected']));
    }

    public freezenColumn(): void {
        const cols: Array<ITableColumn> = this.cache.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == this.currentEditColumn.field) {
                let it: ITableColumn = cols[i];
                it['frozen'] = true;
                this.opsat.publish(GridTopicEnum.FreezeColumn, it);
                break;
            }
        }

        let view: IFilterView = this.cache.activeFilterView;
        view.columns = cols;
        this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
    }

    public unfreezenColumn(): void {
        const cols: Array<ITableColumn> = this.cache.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == this.currentEditColumn.field) {
                let it: ITableColumn = cols[i];
                it['frozen'] = false;
                this.opsat.publish(GridTopicEnum.UnFreezeColumn, it);
                break;
            }
        }

        let view: IFilterView = this.cache.activeFilterView;
        view.columns = cols;
        this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
    }

    public selectChange(evt: MatCheckboxChange, data: any): void {
        data['selected'] = evt.checked;
        let hasSomeNotSelected = this.datas.some(x => !x['selected']);
        let hasSomeSelected = this.datas.some(x => x['selected']);
        this.allRowSelected = !hasSomeNotSelected;
        this.someRowSelected = hasSomeNotSelected && hasSomeSelected;
        this.opsat.publish(GridTopicEnum.RowSelected, this.datas.filter(x => x['selected']));
    }

    private clearSort(excludeField?: string): void {
        if (this.sortColumns.length > 0) {
            this.sortColumns.forEach(it => {
                if (!it.columnField) { return; }

                if (!(excludeField && it.columnField === excludeField)) {
                    it.clearSort();
                }
            });
        }
    }


}
