import { Injectable } from '@angular/core';
import { EQ_OPERATOR, GT_OPERATOR, GTE_OPERATOR, IFilter, IQueryParamTransformPolicy, LIKE_OPERATOR, LT_OPERATOR, LTE_OPERATOR, NE_OPERATOR } from 'cloud-grid';

@Injectable()
export class CubeApiQueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public transform(pagination: { page?: number; limit?: number }, filters?: Array<IFilter>, sort?: { field?: string; direction?: string }, keyword?: string): {} {
        let param: any = {};
        param['index'] = pagination && pagination.page ? pagination.page : 1;
        param['size'] = pagination && pagination.limit ? pagination.limit : 20;

        if (sort && sort.field && sort.direction !== '') {
            let _sort: any = {};
            _sort[sort.field] = sort.direction === 'asc' ? 1 : -1;
            param['sort'] = _sort;
        }

        let _filters: any = {};
        // // 转换filter为查询参数
        if (filters && filters.length > 0) {

            for (let idx: number = filters.length - 1; idx >= 0; idx--) {
                let it: IFilter = filters[idx];

                let _kv: any = {};

                switch (it.operator) {
                    case EQ_OPERATOR: {
                        _kv['$eq'] = it.value;
                        break;
                    }
                    case NE_OPERATOR: {
                        _kv['$ne'] = it.value;
                        break;
                    }
                    case GT_OPERATOR: {
                        _kv['$gt'] = it.value;
                        break;
                    }
                    case GTE_OPERATOR: {
                        _kv['$gte'] = it.value;
                        break;
                    }
                    case LT_OPERATOR: {
                        _kv['$lt'] = it.value;
                        break;
                    }
                    case LTE_OPERATOR: {
                        _kv['$lte'] = it.value;
                        break;
                    }
                    case LIKE_OPERATOR: {
                        _kv['$regex'] = it.value;
                        break;
                    }
                    default:
                        break;
                }

                _filters[it.field] = _kv;
            }
        }

        if (keyword) {
            param['keyword'] = keyword;
        }

        if (Object.keys(_filters)) {
            param['filter'] = _filters;
        }

        // console.log('cube api param:', param);
        return param;
    }
}
