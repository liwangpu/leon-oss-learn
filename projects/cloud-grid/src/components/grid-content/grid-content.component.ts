import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { ITableColumn } from '../../models/i-table-column';
import { Subject, Subscription } from 'rxjs';
import { TableComponent } from '../table/table.component';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { debounceTime, filter, map, delay, take } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IQueryResult } from 'cloud-deed';
import { IFilterView } from '../../models/i-filter-view';

@Component({
    selector: 'cloud-grid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss']
})
export class GridContentComponent implements OnInit, AfterViewInit {

    public enableColumnFrozen: boolean = true;
    public selectMode: string;
    public advancePanel: string;
    public datas: Array<any> = [];
    public unfrozenColumns: Array<ITableColumn> = [];
    public frozenColumns: Array<ITableColumn> = [];
    public unfrozenPanelScroll: Subject<void> = new Subject<void>();
    @ViewChild('frozenPanel', { static: false, read: ElementRef }) public frozenPanel: ElementRef;
    @ViewChild('unfrozenPanel', { static: false, read: ElementRef }) public unfrozenPanel: ElementRef;
    @ViewChildren(TableComponent) public tables: QueryList<TableComponent>;
    private enableFilterView: boolean = false;
    private columns: Array<ITableColumn> = [];
    public constructor(
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private renderer2: Renderer2
    ) {
        // 非冻结表格竖向滚动的时候,往冻结表格加入padding,否则因为非冻结表格出现横向滚动条导致两边滚动高度不同步
        let panelAlignObs: Subscription = this.unfrozenPanelScroll
            .pipe(debounceTime(15))
            .subscribe(() => {
                if (!this.frozenColumns || this.frozenColumns.length < 1) { return; }

                let scrollBarHeight: number = this.unfrozenPanel.nativeElement.offsetHeight - this.unfrozenPanel.nativeElement.clientHeight;
                if (scrollBarHeight < 1) { return; }

                this.renderer2.setStyle(this.frozenPanel.nativeElement, 'padding-bottom', `${scrollBarHeight}px`);
                panelAlignObs.unsubscribe();
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.EnableFilterView))
            .pipe(map(x => x.data))
            .subscribe(enable => this.enableFilterView = enable);
    }

    public ngOnInit(): void {
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.OpenAdvancePanel))
            .pipe(map(x => x.data))
            .subscribe((panel: string) => this.advancePanel = panel);

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.CloseAdvancePanel))
            .subscribe(() => this.advancePanel = null);

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ColumnDefinition))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((cols: Array<ITableColumn>) => {
                for (let idx: number = cols.length - 1; idx >= 0; idx--) {
                    let col: ITableColumn = cols[idx];
                    // tslint:disable-next-line: no-dynamic-delete
                    delete col['sorting_order'];
                }
                if (this.cache.history.sorting.field) {
                    let index: number = cols.findIndex(x => x.field === this.cache.history.sorting.field);
                    if (index > -1) {
                        cols[index]['sorting_order'] = this.cache.history.sorting.direction;
                    }
                }
                this.columns = cols;

                this.unfrozenColumns = this.columns.filter(x => !x['frozen'] && !x['invisibale']);
                this.frozenColumns = this.columns.filter(x => x['frozen'] && !x['invisibale']);
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ListData))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((res: IQueryResult) => {
                this.datas = res.items;
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.EnableColumnFrozen))
            .pipe(take(1))
            .pipe(map(x => x.data))
            .subscribe(enable => this.enableColumnFrozen = enable);

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.RowSelectMode))
            .pipe(take(1))
            .pipe(map(x => x.data))
            .subscribe(mode => this.selectMode = mode);

        // 订阅冻结列或者列可视化编辑保存后,调整左右两表滚动位置
        this.opsat.message.pipe(filter(x => x.topic === GridTopicEnum.ColumnVisialSettingChange || x.topic === GridTopicEnum.FreezeColumn), delay(50)).subscribe(() => {
            if (!this.frozenColumns || this.frozenColumns.length < 1) { return; }
            this.frozenPanel.nativeElement.scrollTop = this.unfrozenPanel.nativeElement.scrollTop;
        });
    }

    public ngAfterViewInit(): void {
        this.unfrozenPanel.nativeElement.addEventListener('scroll', e => {
            if (!this.frozenPanel) { return; }
            this.frozenPanel.nativeElement.scrollTop = e.target.scrollTop;
            this.unfrozenPanelScroll.next();
        });
    }

    public afterColumnResize(): void {
        if (!this.enableFilterView) { return; }
        const view: IFilterView = this.cache.activeFilterView;
        this.tables.forEach(it => {
            let obj: {} = it.calculateColumnWidth();
            let keys: Array<string> = Object.keys(obj);
            for (let field of keys) {
                let index: number = view.columns.findIndex(x => x.field === field);
                view.columns[index].width = obj[field];
            }
        });
        this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
    }


}
