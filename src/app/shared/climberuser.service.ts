import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimberuserService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlClimberUser = this.baseUrl + 'climber-user';
  private readonly httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private readonly httpClient: HttpClient) { }

  updateClimberUserNameById(id: number, userName: string): Observable<any> { // TODO model
    return this.httpClient.put<number>(this.urlClimberUser + '/' + id + '/' + userName, this.httpOptions);
  }
}
