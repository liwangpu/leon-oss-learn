import { Component, OnInit, forwardRef } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { IQueryResult, UrlTool } from 'cloud-deed';
import * as faker from 'faker';
import { OrganizationService } from '../../../ms/services/organization.service';
import { IOrganization } from 'cloud-identity';
import { DStore, ITableColumn } from 'cloud-shared';

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

    public constructor(
        private organSrv: OrganizationService
    ) {
        super();
    }

    public ngOnInit(): void {

    }

    public getColumns(): Observable<Array<ITableColumn>> {
        return of([
            {
                name: '名称',
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

    public onDataEdit(data?: any): void {
        throw new Error('Method not implemented.');
    }

    public onDataDelete(datas: Array<any>): void {
    
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

}
