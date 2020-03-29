import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQueryResult } from 'cloud-deed';
import * as queryString from 'query-string';

@Injectable()
export class IdentityService {

    private uri: string = `http://localhost:9871/ids/identity`;
    public constructor(private httpClient: HttpClient) { }

    public query<IIdentity>(queryParam?: object): Observable<IQueryResult<IIdentity>> {
        queryParam = queryParam ? queryParam : {};
        return this.httpClient.get<IQueryResult>(`${this.uri}?${queryString.stringify(queryParam)}`);
    }

    public create<IIdentity>(entity: IIdentity): Observable<IIdentity> {
        return this.httpClient.post<IIdentity>(`${this.uri}`, entity);
    }

    public get<IIdentity>(id: string): Observable<IIdentity> {
        return this.httpClient.get<IIdentity>(`${this.uri}/${id}`);
    }

    public patch<IIdentity>(id: string, data: any): Observable<IIdentity> {
        return this.httpClient.patch<IIdentity>(`${this.uri}/${id}`, { $set: data });
    }

    public delete(id: string): Observable<any> {
        return this.httpClient.delete(`${this.uri}/${id}`);
    }
}
