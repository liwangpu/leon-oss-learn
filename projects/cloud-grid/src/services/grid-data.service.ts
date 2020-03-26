import { Injectable } from '@angular/core';
import { IFilterView } from '../models/i-filter-view';
import { IHistory } from '../models/i-history';
import { ISelectOption } from '../models/i-select-option';
import { ITableColumn } from '../models/i-table-column';

@Injectable()
export class GridDataService {
    public get columns(): Array<ITableColumn> {
        return this.activeFilterView.columns;
    }

    public get activeFilterView(): IFilterView {
        return this.filterViews.filter(x => x['active'])[0];
    }

    public get filterViews(): Array<IFilterView> {
        return this._filterViews;
    }

    public set filterViews(val: Array<IFilterView>) {
        this._filterViews = val ? val : [];
    }

    public history: IHistory = { pagination: {}, sorting: {}, keyword: null };
    public advanceSettingPanel: string;
    public fieldInfos: { [key: string]: Array<ISelectOption> };

    private _filterViews: Array<IFilterView>;

}
