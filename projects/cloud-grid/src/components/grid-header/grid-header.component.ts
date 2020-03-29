import { Component, OnInit, Inject } from '@angular/core';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { filter, map, delay } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IHistory } from '../../models/i-history';
import { IFilterView } from '../../models/i-filter-view';
import { GridAdvanceViewEnum } from '../../enums/grid-advance-view.enum';
import { MatDialog } from '@angular/material/dialog';
import { ColumnVisualEditingPanelComponent } from '../column-visual-editing-panel/column-visual-editing-panel.component';
import { ArrayTool } from '../../utils/array-tool';
import { ITableColumn } from '../../models/i-table-column';

@Component({
    selector: 'cloud-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {

    public enableDelete: boolean = false;
    public enableFilterView: boolean = false;
    public enableReturn: boolean = false;
    public keyword: string;
    public activeFilterViewName: string = '全部';
    public filterViews: Array<{ id: string, name: string }>;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        public dialogService: MatDialog,
        private opsat: GridOpsatService,
        private cache: GridDataService
    ) {

    }

    public ngOnInit(): void {

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.History))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((h: IHistory) => {
                let keywordBlur: boolean = h.keyword && h.keyword !== '' ? true : false;
                let paginatorBlur: boolean = h.pagination.page > 1 || (h.pagination.limit && h.pagination.limit !== this.gridConfig.rowsPerPageOptions[0]) ? true : false;
                let sortingBlur: boolean = h.sorting.field ? true : false;
                let dynamicFilterBlur: boolean = h.dynamicFilters && h.dynamicFilters.length > 0 ? true : false;
                this.enableReturn = keywordBlur || paginatorBlur || sortingBlur || dynamicFilterBlur;
                this.keyword = h.keyword;
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ViewDefinition))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((views: Array<IFilterView>) => {
                this.filterViews = views.map(x => { return { id: x.id, name: x.name }; });
                this.activeFilterViewName = this.cache.activeFilterView.name;
            });

        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.EnableFilterView))
            .pipe(map(x => x.data))
            .subscribe(enable => this.enableFilterView = enable);

            
    }

    public filter(): void {
        let advanceView: string = this.cache.advanceSettingPanel;
        if (advanceView === GridAdvanceViewEnum.Filter) {
            this.cache.advanceSettingPanel = null;
            this.opsat.publish(GridTopicEnum.CloseAdvancePanel);
            return;
        }
        this.cache.advanceSettingPanel = GridAdvanceViewEnum.Filter;
        this.opsat.publish(GridTopicEnum.OpenAdvancePanel, GridAdvanceViewEnum.Filter);
    }

    public refresh(): void {
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public search(): void {
        this.cache.history.keyword = this.keyword;
        this.cache.history.pagination.page = 1;
        this.cache.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        this.cache.history.sorting.field = undefined;
        this.cache.history.sorting.direction = undefined;
        this.cache.history.dynamicFilters = this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length ? this.cache.history.dynamicFilters.filter(x => x.buildIn) : undefined;
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public reset(): void {
        this.keyword = undefined;
        this.cache.history.keyword = undefined;
        this.cache.history.pagination.page = 1;
        this.cache.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        this.cache.history.sorting.field = undefined;
        this.cache.history.sorting.direction = undefined;
        this.cache.history.dynamicFilters = this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length ? this.cache.history.dynamicFilters.filter(x => x.buildIn) : undefined;
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public toggleView(id: string): void {
        const views: Array<IFilterView> = this.cache.filterViews;
        for (let idx: number = views.length - 1; idx >= 0; idx--) {
            let it: IFilterView = views[idx];
            it['active'] = it.id === id;
            if (it.id === id) {
                this.activeFilterViewName = it.name;
                this.cache.history.viewId = it.id;
            }
        }
        this.keyword = undefined;
        this.cache.history.keyword = undefined;
        this.cache.history.pagination.page = 1;
        this.cache.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        this.cache.history.sorting.field = undefined;
        this.cache.history.sorting.direction = undefined;
        this.cache.history.dynamicFilters = this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length ? this.cache.history.dynamicFilters.filter(f => f.buildIn) : undefined;
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public columnVisualSetting(): void {
        const ref = this.dialogService.open(ColumnVisualEditingPanelComponent, {
            width: '600px',
            height: '400px',
            data: ArrayTool.deepCopy(this.cache.columns)
        });

        ref.afterClosed()
            .pipe(filter(x => x))
            .subscribe((cols: Array<ITableColumn>) => {
                const view: IFilterView = this.cache.activeFilterView;
                view.columns = cols;
                this.opsat.publish(GridTopicEnum.ColumnVisialSettingChange);
                this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
            });
    }
}
