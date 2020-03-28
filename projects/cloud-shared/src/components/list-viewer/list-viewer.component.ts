import { Component, OnInit, forwardRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IQueryResult, UrlTool } from 'cloud-deed';
import { IFilterView, ITableColumn, ISelectOption, DStore } from 'cloud-grid';
import { DStore as ListViewDStore } from '../../models/dstore';

@Component({
    selector: 'cloud-shared-list-viewer',
    templateUrl: './list-viewer.component.html',
    styleUrls: ['./list-viewer.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => ListViewerComponent)
        }
    ]
})
export class ListViewerComponent extends DStore implements OnInit {

    private pageKey: string;
    private filterViews: Array<IFilterView> = [];
    public constructor(
        private dstore: ListViewDStore
    ) {
        super();
        if (location) {
            this.pageKey = UrlTool.getPath(location.href);
            this.filterViews = this.getTemporyViewInLocalStorage();
        }
    }

    public ngOnInit(): void {
        this.temporaryStoreViewToLocalStorage();
        this.startup({ enableColumnFrozen: true, enableView: true, enableUrlHistory: true });
    }

    public getColumns(): Observable<Array<ITableColumn>> {
        return this.dstore.getColumns();
    }

    public onQuery(queryParam?: {}): Observable<IQueryResult<any>> {
        return this.dstore.onQuery(queryParam);
    }

    public getFilterViews(): Observable<Array<IFilterView>> {
        return of(this.filterViews);
    }

    public onFilterViewCreate(view: IFilterView): Observable<void> {
        view.id = Date.now().toString();
        this.filterViews.push(view);
        this.temporaryStoreViewToLocalStorage();
        return of(null);
    }

    public onFilterViewUpdate(view: IFilterView): Observable<void> {
        let index: number = this.filterViews.findIndex(x => x.id);
        if (index > -1) {
            this.filterViews[index] = view;
        }
        this.temporaryStoreViewToLocalStorage();
        return of(null);
    }

    public getSelectOptions(reference: string): Observable<Array<ISelectOption>> {
        throw new Error("Method not implemented.");
    }

    public onDataEdit(data: any): void {
        throw new Error("Method not implemented.");
    }

    public onLinkFieldClick(field: string, data: any): void {
        throw new Error("Method not implemented.");
    }

    public onDataSelected(datas: any[]): void {
        throw new Error("Method not implemented.");
    }

    private temporaryStoreViewToLocalStorage(): void {
        localStorage.setItem(`${this.pageKey}@ListViews`, JSON.stringify(this.filterViews));
    }

    private getTemporyViewInLocalStorage(): Array<IFilterView> {
        const viewsStr: string = localStorage.getItem(`${this.pageKey}@ListViews`);
        let views: Array<IFilterView> = JSON.parse(viewsStr);
        return views && views.length > 0 ? views : [];
    }

}
