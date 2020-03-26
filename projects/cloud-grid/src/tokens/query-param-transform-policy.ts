import { InjectionToken } from '@angular/core';
import { IFilter } from '../models/i-filter';

export interface IQueryParamTransformPolicy {
    transform(pagination: { page?: number; limit?: number }, filters?: Array<IFilter>, sort?: { field?: string; direction?: string }, keyword?: string): {};
}

export const QUERYPARAMTRANSFORMPOLICY: InjectionToken<IQueryParamTransformPolicy> = new InjectionToken<IQueryParamTransformPolicy>('grid query param transform policy');
