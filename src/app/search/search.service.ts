import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private readonly baseUrl = 'http://localhost:8085/api/';
    private readonly urlSearches = this.baseUrl + 'searches';

    constructor(private readonly httpClient: HttpClient) { }

    getAllSearches() {
        return this.httpClient.get(this.urlSearches);
    }

    createSearch(search: any): Observable<any> { // TODO Search model
        return this.httpClient.post(this.urlSearches, search);
    }
}
