import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LanguageRequest} from "../model/languageRequest";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlUser = this.baseUrl + 'user/';
  private languageRequest: LanguageRequest;

  constructor(private readonly httpClient: HttpClient) { }

  getLanguageId(userId: number): Observable<any> {
    return this.httpClient.get<number>(this.urlUser + userId + '/language');
  }

  updateUserLanguage(userId: number, languageId :number): Observable<any> {
    this.languageRequest = {languageId: languageId }
    return this.httpClient.patch<number>(this.urlUser + userId + '/language', this.languageRequest)
  }
}
