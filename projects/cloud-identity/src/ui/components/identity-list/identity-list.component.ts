import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore, ITableColumn } from 'cloud-shared';
import { IdentityService } from '../../../ms/services/identity.service';
import { Observable, of } from 'rxjs';
import { IQueryResult } from 'cloud-deed';

@Component({
    selector: 'cloud-identity-identity-list',
    templateUrl: './identity-list.component.html',
    styleUrls: ['./identity-list.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => IdentityListComponent)
        }
    ]
})
export class IdentityListComponent extends DStore implements OnInit {


    public constructor(
        private identitySrv: IdentityService
    ) {
        super();
    }

    public ngOnInit(): void {
    }

    public getColumns(): Observable<Array<ITableColumn>> {
        return of([
            {
                name: '姓名',
                field: 'name',
                sort: true
            },
            {
                name: '电话',
                field: 'phone',
                sort: true
            },
            {
                name: '邮件',
                field: 'email',
                sort: true
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
        return this.identitySrv.query(queryParam);
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
}
