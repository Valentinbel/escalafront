import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly baseUrl = 'http://localhost:8085/api/matches';

  constructor(private readonly httpClient: HttpClient) { }

  createMatchBySearchId(searchId: number) {
    return this.httpClient.get<any>(this.baseUrl + "/search/" + searchId); //any: match
  }
}
