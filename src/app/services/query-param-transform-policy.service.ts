import { Injectable } from '@angular/core';
import { IQueryParamTransformPolicy, IFilter } from 'cloud-grid';

@Injectable()
export class QueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public constructor() { }
    public transform(pagination: { page?: number; limit?: number; }, filters?: IFilter[], sort?: { field?: string; direction?: string; }, keyword?: string): {} {
        let param: any = {};
        param['page'] = pagination && pagination.page ? pagination.page : 1;
        param['pageSize'] = pagination && pagination.limit ? pagination.limit : 20;

        if (sort && sort.field && sort.direction !== '') {
            let _sort: any = {};
            _sort[sort.field] = sort.direction === 'asc' ? 1 : -1;
            param['orderBy'] = sort.field;
            param['desc'] = sort.direction === 'asc' ? false : true;
        }

        if (keyword) {
            param['search'] = keyword;
        }
        return param;
    }
}
