import { Observable } from 'rxjs';
import { ITableColumn } from 'cloud-grid';
import { IQueryResult } from 'cloud-deed';

export abstract class DStore {
    protected refreshCallBack: Function;
    public abstract getColumns(): Observable<Array<ITableColumn>>;
    public abstract onQuery(queryParam?: {}): Observable<IQueryResult>;
    public abstract onDataEdit(data?: any): void;
    public abstract onDataDelete(datas: Array<any>): void;
    public abstract onLinkFieldClick(field: string, data: any): void;
    public abstract onDataSelected(datas: Array<any>): void;
    public refresh(): void {
        this.refreshCallBack();
    }

    public registryRefreshCallBack(cb: Function) {
        this.refreshCallBack = cb;
    }
}
