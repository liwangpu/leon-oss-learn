import { Observable } from 'rxjs';
import { IFilterView } from './i-filter-view';
import { ISelectOption } from './i-select-option';
import { ITableColumn } from './i-table-column';
import { IQueryResult } from 'cloud-deed';

export abstract class DStore {
    protected startupCallBack: (option?: any) => void;
    public abstract getColumns(): Observable<Array<ITableColumn>>;
    public abstract onQuery(queryParam?: {}): Observable<IQueryResult>;
    public abstract getFilterViews(): Observable<Array<IFilterView>>;
    public abstract onFilterViewCreate(view: IFilterView): Observable<void>;
    public abstract onFilterViewUpdate(view: IFilterView): Observable<void>;
    public abstract getSelectOptions(reference: string): Observable<Array<ISelectOption>>;
    public abstract onDataEdit(data: any): void;
    public abstract onLinkFieldClick(field: string, data: any): void;
    public abstract onDataSelected(datas: Array<any>): void;
    public startup(option?: any): void {
        this.startupCallBack(option);
    }

    public registryStartupCallBack(cb: (option?: any) => void): void {
        this.startupCallBack = cb;
    }
}
