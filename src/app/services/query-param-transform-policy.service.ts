import { Injectable } from '@angular/core';
import { IQueryParamTransformPolicy, IFilter } from 'cloud-grid';

@Injectable()
export class QueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public constructor() { }
    public transform(pagination: { page?: number; limit?: number; }, filters?: IFilter[], sort?: { field?: string; direction?: string; }, keyword?: string): {} {
        return {};
    }
}
