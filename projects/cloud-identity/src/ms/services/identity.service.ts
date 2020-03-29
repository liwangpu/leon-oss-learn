import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQueryResult } from 'cloud-deed';
import { map } from 'rxjs/operators';
import * as queryString from 'query-string';
@Injectable()
export class IdentityService {

    private uri: string = `http://localhost:9871/ids/identity`;
    public constructor(private httpClient: HttpClient) { }

    public query<T = any>(queryParam?: object): Observable<IQueryResult<T>> {
        queryParam = queryParam ? queryParam : {};
        return this.httpClient.get<IQueryResult>(`${this.uri}?${queryString.stringify(queryParam)}`);
    }

    public create<T = any>(entity: T): Observable<T> {
        return this.httpClient.post<T>(`${this.uri}`, entity);
    }

    public get<T = any>(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.uri}/${id}`);
    }

    public patch<T = any>(id: string, data: any): Observable<T> {
        return this.httpClient.patch<T>(`${this.uri}/${id}`, { $set: data });
    }
}
