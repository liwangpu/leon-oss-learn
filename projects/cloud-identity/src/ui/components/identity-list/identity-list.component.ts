import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore, ITableColumn } from 'cloud-shared';
import { IdentityService } from '../../../ms/services/identity.service';
import { Observable, of, forkJoin } from 'rxjs';
import { IQueryResult } from 'cloud-deed';
import * as faker from 'faker';
import { IIdentity } from '../../../ms/models/i-identity';

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
                name: '用户名',
                field: 'username',
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
        return this.identitySrv.query(queryParam);
    }

    public onDataEdit(data: any): void {
        throw new Error('Method not implemented.');
    }

    public onDataDelete(datas: Array<IIdentity>): void {
        forkJoin(datas.map(x => this.identitySrv.delete(x.id))).subscribe(() => {
            console.log('数据删除完毕');
            this.refresh();
        });
    }

    public onLinkFieldClick(field: string, data: any): void {
        throw new Error('Method not implemented.');
    }

    public onDataSelected(datas: Array<any>): void {
        throw new Error('Method not implemented.');
    }

    public addFackerData(): void {
        let organs: Array<IIdentity> = [];
        for (let i = 0; i < 50; i++) {
            const name: string = faker.name.findName();
            organs.push({
                name: name,
                phone: faker.phone.phoneNumber(),
                email: faker.internet.email(),
                password: '123456',
                username: name.replace('', '_')
            });
        }
        forkJoin(organs.map(x => this.identitySrv.create(x))).subscribe(() => {
            console.log('数据生成完毕');
            this.refresh();
        });
    }
}
