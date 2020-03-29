import { Component, OnInit, Inject } from '@angular/core';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataService } from '../../services/grid-data.service';
import { filter, map, delay } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IQueryResult } from 'cloud-deed';
import { IHistory } from '../../models/i-history';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'cloud-grid-footer',
    templateUrl: './grid-footer.component.html',
    styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit {

    public rowsPerPageOptions: Array<number>;
    public dataTotal: number = 0;
    // public paginatorFirst: number = 0;
    public pageIndex = 0;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        private opsat: GridOpsatService,
        private cache: GridDataService
    ) {
        this.rowsPerPageOptions = this.gridConfig.rowsPerPageOptions;
    }

    public ngOnInit(): void {
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.ListData))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((res: IQueryResult) => {
                if (typeof res.count !== 'undefined') {
                    this.dataTotal = res.count;
                }
            });
        this.opsat.message
            .pipe(filter(x => x.topic === GridTopicEnum.History))
            .pipe(map(x => x.data))
            .pipe(delay(100))
            .subscribe((history: IHistory) => {
                // this.paginatorFirst = history.pagination.page - 1 > 0 ? (history.pagination.page - 1) * history.pagination.limit : 0;
                this.pageIndex = history.pagination.page ? history.pagination.page - 1 : 0;
                // console.log('page size', history.pagination.page);
            });
    }

    public onPageChange(evt: PageEvent): void {
        this.cache.history.pagination.page = evt.pageIndex + 1;
        this.cache.history.pagination.limit = evt.pageSize;
        this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

}
