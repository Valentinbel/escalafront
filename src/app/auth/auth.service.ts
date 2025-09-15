import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../model/register.model';
import { MessageResponse } from '../model/message-response.model';
import { LoginResponse } from '../model/login-response.model';
import { Login } from '../model/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlAuth = this.baseUrl + 'auth/';
  private readonly httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private readonly httpClient: HttpClient) { }

  login(loginForm: Login ): Observable<LoginResponse> { 
    return this.httpClient.post<LoginResponse>(this.urlAuth + 'login', loginForm, this.httpOptions);
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
}
