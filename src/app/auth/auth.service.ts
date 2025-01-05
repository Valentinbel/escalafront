import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../model/register.model';
import { MessageResponse } from '../model/message-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:8080/api/';
  private readonly urlAuth = this.baseUrl + 'auth/';
  private readonly httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private readonly httpClient: HttpClient) { }

  login(userName: string, password: string ): Observable<any> { // TODO: model
    return this.httpClient.post(
      this.urlAuth + 'login',
      {
        userName, password,
      }, this.httpOptions
    );
  }

  register(registerForm: Register): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(this.urlAuth + 'register',registerForm, this.httpOptions);
  }

  logout(userId: number): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(this.urlAuth + 'signout/'+ userId, this.httpOptions); 
  }

  refreshToken(): Observable<any>  { // TODO: model
    console.log("refreshToken/////////////////////////////////")
    return this.httpClient.post(this.urlAuth + 'refreshtoken', { }, this.httpOptions);
  }

  updateClimberUser(userId: number, profileId: number) : Observable<any>  { // TODO: model
    return this.httpClient.put(this.baseUrl + 'climber-users', {userId, profileId}, this.httpOptions)
  }
}
