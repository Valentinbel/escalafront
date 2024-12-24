import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:8080/api/';
  private readonly urlAuth = this.baseUrl + 'auth/';
  private readonly httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private readonly http: HttpClient) { }

  login(userName: string, password: string ): Observable<any> { // TODO: model
    return this.http.post(
      this.urlAuth + 'login',
      {
        userName, password,
      }, this.httpOptions
    );
  }

  register(userName: string, email: string, password: string): Observable<any> { // TODO: model
    return this.http.post(
      this.urlAuth + 'register',
      {
        userName, email, password,
      }, this.httpOptions
    );
  }

  logout(userId: number): Observable<any> {
    return this.http.post(this.urlAuth + 'signout/'+ userId, this.httpOptions); 
  }

  refreshToken(): Observable<any>  { // TODO: model
    console.log("refreshToken/////////////////////////////////")
    return this.http.post(this.urlAuth + 'refreshtoken', { }, this.httpOptions);
  }

  updateClimberUser(userId: number, profileId: number) : Observable<any>  { // TODO: model
    return this.http.put(this.baseUrl + 'climber-users', {userId, profileId}, this.httpOptions)
  }
}
