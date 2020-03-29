import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { IFilterView } from '../../models/i-filter-view';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { QUERYPARAMTRANSFORMPOLICY, IQueryParamTransformPolicy } from '../../tokens/query-param-transform-policy';
import { DStore } from '../../models/dstore';
import { Router, ActivatedRoute } from '@angular/router';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilter } from '../../models/i-filter';
import { FilterUrlParser } from '../../utils/filter-url-parser';
import { take, filter, map, switchMap } from 'rxjs/operators';
import { Observable, of, forkJoin, combineLatest } from 'rxjs';
import { ITableColumn } from '../../models/i-table-column';
import { IQueryResult, UrlTool } from 'cloud-deed';
import { ISelectOption } from '../../models/i-select-option';
import { IHistory } from '../../models/i-history';
import { ArrayTool } from '../../utils/array-tool';
import { ObjectTool } from '../../utils/object-tool';
import * as queryString from 'query-string';
import { Location } from '@angular/common';
import { GridAdvanceViewEnum } from '../../enums/grid-advance-view.enum';

@Component({
    selector: 'cloud-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        GridDataService,
        GridOpsatService
    ]
})
export class GridComponent implements OnInit, AfterViewInit {

    private allFilterView: IFilterView;
    private enableUrlHistory: boolean = false;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        @Inject(QUERYPARAMTRANSFORMPOLICY) private queryTransformPolicy: IQueryParamTransformPolicy,
        private dstore: DStore,
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private router: Router,
        private acr: ActivatedRoute,
        private locationSrv: Location

    ) {
        this.dstore.registryStartupCallBack((option?: any) => {
            if (!option) { return; }

            if (option['enableEdit']) {
                this.opsat.publish(GridTopicEnum.EnableRowOperation);
            }

            if (option['selectMode']) {
                this.opsat.publish(GridTopicEnum.RowSelectMode, option['selectMode']);
            }

            // tslint:disable-next-line: no-redundant-boolean
            this.opsat.publish(GridTopicEnum.EnableFilterView, option['enableView'] ? true : false);
            // tslint:disable-next-line: no-redundant-boolean
            this.opsat.publish(GridTopicEnum.EnableColumnFrozen, option['enableColumnFrozen'] ? true : false);

            if (option['enableUrlHistory']) {
                this.enableUrlHistory = true;
                this.acr.queryParams.subscribe(prm => {
                    let pageIndex: number = prm['page'] ? Number(prm['page']) : 1;
                    let pageLimit: number = prm['limit'] ? Number(prm['limit']) : this.gridConfig.rowsPerPageOptions[0];
                    let keyword: string = prm['keyword'];
                    let viewId: string = prm['view'];
                    let sortField: string = prm['sort'];
                    let sortDirection: string = prm['order'];
                    let filters: string = prm['filters'];

                    let urlDyFilters: Array<IFilter> = FilterUrlParser.parser(filters);
                    if (this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length && urlDyFilters && urlDyFilters.length) {
                        this.cache.history.dynamicFilters = this.cache.history.dynamicFilters.concat(urlDyFilters);
                    }

                    this.cache.history.pagination.page = pageIndex;
                    this.cache.history.pagination.limit = pageLimit;
                    this.cache.history.sorting.field = sortField;
                    this.cache.history.sorting.direction = sortDirection;
                    this.cache.history.keyword = keyword;
                    this.cache.history.viewId = viewId;
                    this.opsat.publish(GridTopicEnum._History, this.cache.history);
                });
            } else {
                this.opsat.publish(GridTopicEnum._History, this.cache.history);
            }

        });

        this.dstore.registryRefreshCallBack(() => {
            this.refreshQuery();
        });

        // log整个表格通讯信息
        // this.opsat.message.subscribe(ms => console.log('message:', ms));
        // this.opsat.publish(GridTopicEnum.OpenAdvancePanel, GridAdvanceViewEnum.Filter);
    }

    public renderComponent(): void {
        // 获取表格列定义
        this.dstore.getColumns()
            .pipe(take(1))
            .subscribe(cols => this.opsat.publish(GridTopicEnum._ColumnDefinition, cols));

        // 获取视图定义
        this.dstore.getFilterViews()
            .pipe(take(1))
            .subscribe(views => this.opsat.publish(GridTopicEnum._ViewDefinition, views));
    }

    public refreshQuery(): void {
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public ngOnInit(): void {

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum._ListData))
            .pipe(map(x => x.data))
            .pipe(map((res: IQueryResult) => {
                if (res.items && res.items.length > 0) {
                    let noStart = this.cache?.history?.pagination?.page ? (this.cache?.history?.pagination?.page - 1) * this.cache.history.pagination.limit : 0;
                    for (let i = 0, len = res.items.length; i < len; i++) {
                        noStart++;
                        res.items[i]['no'] = noStart;
                    }
                }
                return res;
            }))
            .subscribe(res => {
                this.opsat.publish(GridTopicEnum.ListData, res);
            });


        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.History))
            .pipe(switchMap(() => {
                let filters: Array<IFilter> = [];
                if (this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length > 0) {
                    filters = filters.concat(this.cache.history.dynamicFilters);
                }
                if (this.cache.activeFilterView.filters && this.cache.activeFilterView.filters.length > 0) {
                    filters = filters.concat(this.cache.activeFilterView.filters);
                }

                const queryParam: {} = this.queryTransformPolicy.transform(this.cache.history.pagination, filters, this.cache.history.sorting, this.cache.history.keyword);
                return this.dstore.onQuery(queryParam);
            }))
            .subscribe(res => {
                this.opsat.publish(GridTopicEnum._ListData, res);
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum._HistoryChange))
            .pipe(map(x => x.data))
            .subscribe((h: IHistory) => {
                let urlArr: Array<string> = this.router.url.split('?');
                let urlObj: object = urlArr.length < 2 ? {} : queryString.parse(urlArr[1]);
                // tslint:disable-next-line: no-dynamic-delete
                delete urlObj['keyword'];
                // tslint:disable-next-line: no-dynamic-delete
                delete urlObj['sort'];
                // tslint:disable-next-line: no-dynamic-delete
                delete urlObj['order'];
                // tslint:disable-next-line: no-dynamic-delete
                delete urlObj['view'];

                urlObj['page'] = h.pagination.page;
                urlObj['limit'] = h.pagination.limit;

                if (h.viewId && h.viewId !== '_ALL') {
                    urlObj['view'] = h.viewId;
                }
                if (h.keyword && h.keyword !== '') {
                    urlObj['keyword'] = h.keyword;
                }

                if (h.sorting.field) {
                    urlObj['sort'] = h.sorting.field;
                    urlObj['order'] = h.sorting.direction;
                }

                // tslint:disable-next-line: no-dynamic-delete
                delete urlObj['filters'];
                if (h.dynamicFilters && h.dynamicFilters.length > 0) {
                    let notBuildInFilters: Array<IFilter> = h.dynamicFilters.filter(x => !x.buildIn);
                    if (notBuildInFilters && notBuildInFilters.length > 0) {
                        urlObj['filters'] = FilterUrlParser.stringify(notBuildInFilters);
                    }
                }

                // this.opsat.publish(GridTopicEnum._History, this.cache.history);
                if (this.enableUrlHistory) {
                    let prmStr: string = queryString.stringify(urlObj);
                    if (urlArr[1] && urlArr[1] === prmStr) {
                        this.opsat.publish(GridTopicEnum._History, this.cache.history);
                    } else {
                        this.router.navigateByUrl(`${urlArr[0]}?${prmStr}`);
                    }
                } else {
                    this.opsat.publish(GridTopicEnum._History, this.cache.history);
                }
            });

        // 订阅视图创建/更新事件
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.FilterViewCreateOrUpdate))
            .pipe(map(x => x.data))
            .pipe(switchMap(view => {
                // 全部视图在页面刷新前临时存储
                if (view.id === '_ALL') {
                    this.allFilterView = view;
                    return of(view);
                }

                if (view.id) {
                    return this.dstore.onFilterViewUpdate(view).pipe(map(() => view));
                }
                return this.dstore.onFilterViewCreate(view).pipe(map(() => view));
            }))
            .pipe(switchMap(view => this.dstore.getFilterViews().pipe(map(views => [view, views]))))
            .subscribe((arr: [IFilterView, Array<IFilterView>]) => {
                let [view, views] = arr;
                this.cache.history.viewId = view.id;
                this.opsat.publish(GridTopicEnum._ViewDefinition, views);
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.LinkFieldClick))
            .pipe(map(x => x.data))
            .subscribe((item: { field: string; data: any }) => this.dstore.onLinkFieldClick(item.field, item.data));

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.RowSelected))
            .pipe(map(x => x.data))
            .subscribe(datas => this.dstore.onDataSelected(datas));

        this.renderComponent();
    }

    public ngAfterViewInit(): void {
        // 结合列和视图定义,做初始输入流信息转换
        this.transformViewDefinition();

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.RowOperating))
            .pipe(map(x => x.data))
            .subscribe((res: { operation: string; data: any }) => {
                if (res.operation === 'edit') {
                    this.dstore.onDataEdit(res.data);
                } else if (res.operation === 'delete') {
                    this.dstore.onDataDelete(res.data);
                } else {

                }
            });
        // setTimeout(() => {
        //     this.opsat.publish(GridTopicEnum.OpenAdvancePanel, GridAdvanceViewEnum.Filter);
        // }, 800);
    }

    public setDynamicFilter(filters: Array<IFilter>): void {
        this.cache.history.dynamicFilters = filters;
        // console.log('dynamic filters:', filters);
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    private transformViewDefinition(): void {
        const colDefinitionfObs: Observable<any> = this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum._ColumnDefinition))
            .pipe(map(x => x.data));
        const viewDefinitionObs: Observable<any> = this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum._ViewDefinition))
            .pipe(map(x => x.data));
        const historyObs: Observable<any> = this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum._History))
            .pipe(map(x => x.data));

        combineLatest(colDefinitionfObs, viewDefinitionObs, historyObs).subscribe((resArr: [Array<ITableColumn>, Array<IFilterView>, IHistory]) => {
            let cols: Array<ITableColumn> = ArrayTool.deepCopy(resArr[0]);
            let views: Array<IFilterView> = ArrayTool.deepCopy(resArr[1]);
            let history: IHistory = ObjectTool.deepCopy(resArr[2]);
            // 1.默认视图可能是没有columns定义的,如果没有,需要把资源的columns赋值上去
            // 2.清除view active定义
            // 首先添加默认"全部"视图
            views.unshift(this.allFilterView ? this.allFilterView : { id: '_ALL', name: '全部', columns: cols });

            for (let idx: number = views.length - 1; idx >= 0; idx--) {
                let view: IFilterView = views[idx];
                view.columns = view.columns ? view.columns : [];
                view['active'] = false;
                if (!view.columns || view.columns.length === 0) {
                    let viewCols: Array<ITableColumn> = view.columns;
                    for (let cdx: number = 0, len: number = cols.length; cdx < len; cdx++) {
                        let col: ITableColumn = cols[cdx];
                        let index: number = viewCols && viewCols.length > 0 ? viewCols.findIndex(x => x.field === col.field) : -1;
                        if (index > -1) {
                            col = viewCols[index];
                        }
                        view.columns.push(col);
                    }
                }
            }

            let viewIndex: number = history.viewId ? views.findIndex(x => x.id === history.viewId) : 0;
            if (viewIndex === -1) {
                this.cache.history.viewId = undefined;
                history.viewId = undefined;
                viewIndex = 0;
            }

            views[viewIndex]['active'] = true;
            this.cache.filterViews = views;

            // console.log('views', views);
            this.opsat.publish(GridTopicEnum.ColumnDefinition, views[viewIndex].columns);
            this.opsat.publish(GridTopicEnum.ViewDefinition, views);
            this.opsat.publish(GridTopicEnum.History, history);
        });
    }


}
