import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQueryResult } from 'cloud-deed';
import { map } from 'rxjs/operators';

@Injectable()
export class OrganizationService {

    private uri: string = `${environment.APIServer}/data/organization`;
    public constructor(private httpClient: HttpClient) { }

    public query<T = any>(queryParam?: object): Observable<IQueryResult<T>> {
        queryParam = queryParam ? queryParam : {};
        let pagingQuery: string = `size=${queryParam['size'] ? queryParam['size'] : 20}&index=${queryParam['index'] ? queryParam['index'] : 1}`;

        return this.httpClient.post<IQueryResult>(`${this.uri}/query?${pagingQuery}`, queryParam)
            .pipe(map(res => {
                res['count'] = res['total'];
                res.items = res.items ? res.items : [];
                return res;
            }));
    }

    public create<T = any>( entity: T): Observable<T> {
        return this.httpClient.post<T>(`${this.uri}`, entity);
    }

    public get<T = any>( id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.uri}/${id}`);
    }

    public patch<T = any>( id: string, data: any): Observable<T> {
        return this.httpClient.patch<T>(`${this.uri}/${id}`, { $set: data });
    }
}
