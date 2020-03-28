import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore, IFilterView, ITableColumn, ISelectOption } from 'cloud-grid';
import { Observable, of, forkJoin } from 'rxjs';
import { IQueryResult, UrlTool } from 'cloud-deed';
import * as faker from 'faker';
import { OrganizationService } from '../../../ms/services/organization.service';
import { IOrganization } from 'cloud-identity';

@Component({
    selector: 'cloud-identity-organization-list',
    templateUrl: './organization-list.component.html',
    styleUrls: ['./organization-list.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => OrganizationListComponent)
        }
    ]
})
export class OrganizationListComponent extends DStore implements OnInit {


    private pageKey: string;
    private filterViews: Array<IFilterView> = [];
    public constructor(
        private organSrv: OrganizationService
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
        return of([
            {
                name: '名称',
                field: 'name'
            },
            {
                name: '电话',
                field: 'phone'
            },
            {
                name: '邮件',
                field: 'email'
            },
            {
                name: '描述',
                field: 'description'
            }
        ]);
    }

    public onQuery(queryParam?: {}): Observable<IQueryResult<any>> {
        // console.log('q',queryParam);
        let keyword: string = queryParam['keyword'] && queryParam['keyword'] !== '' ? queryParam['keyword'] : undefined;
        // 关键词搜索列设置
        if (keyword) {
            queryParam['filter'] = queryParam['filter'] ? queryParam['filter'] : {};
            let orFilters: Array<any> = [];
            // for (let field of this.keywordSearchColumns) {
            // tslint:disable-next-line: no-shadowed-variable
            let filter: any = {};
            filter['name'] = { $regex: keyword };
            orFilters.push(filter);
            // }
            queryParam['filter']['$or'] = orFilters;
        }

        if (keyword) {
            // tslint:disable-next-line: no-dynamic-delete
            delete queryParam['keyword'];
        }
        return this.organSrv.query(queryParam);
    }

    public getFilterViews(): Observable<Array<IFilterView>> {
        return of(this.filterViews);
    }

    public onFilterViewCreate(view: IFilterView): Observable<void> {
        console.log('view create', view);
        view.id = Date.now().toString();
        this.filterViews.push(view);
        this.temporaryStoreViewToLocalStorage();
        return of(null);
    }

    public onFilterViewUpdate(view: IFilterView): Observable<void> {
        console.log('view update', view);
        let index: number = this.filterViews.findIndex(x => x.id);
        if (index > -1) {
            this.filterViews[index] = view;
        }
        this.temporaryStoreViewToLocalStorage();
        return of(null);
    }

    public getSelectOptions(reference: string): Observable<Array<ISelectOption>> {
        throw new Error('Method not implemented.');
    }

    public onDataEdit(data: any): void {
        throw new Error('Method not implemented.');
    }

    public onLinkFieldClick(field: string, data: any): void {
        throw new Error('Method not implemented.');
    }

    public onDataSelected(datas: Array<any>): void {
        throw new Error('Method not implemented.');
    }

    public addFackerData(): void {
        let organs: Array<IOrganization> = [];
        for (let i = 0; i < 50; i++) {
            organs.push({
                name: faker.name.findName(),
                phone: faker.phone.phoneNumber(),
                email: faker.internet.email(),
                description: faker.lorem.paragraph()
            });
        }
        forkJoin(organs.map(x => this.organSrv.create(x))).subscribe(() => {
            alert('数据生成完毕!');
        });
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
