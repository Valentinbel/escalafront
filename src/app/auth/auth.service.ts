import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8080/api/auth/'; // mettre en private readonly comme on sait faire

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  login(userName: string, password: string ): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        userName, password,
      }, httpOptions
    );
  }

  register(userName: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      {
        userName, email, password,
      }, httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
