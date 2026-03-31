import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Search} from "../model/search.model";

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private readonly baseUrl = 'http://localhost:8085/api/';
    private readonly urlSearches = this.baseUrl + 'searches';

    constructor(private readonly httpClient: HttpClient) { }

    getAllSearches(): Observable<Search[]> {
        return this.httpClient.get<Search[]>(this.urlSearches);
    }

    createSearch(search: any): Observable<any> { // TODO Search model
        return this.httpClient.post(this.urlSearches, search);
    }
}
