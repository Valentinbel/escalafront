import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly apiUrl = 'http://localhost:8081/api/test/';  /// Changer par un private readonly comme dans TIG et climberprofile service pour voir si ca marche toujours
  
  constructor(private readonly httpClient: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'user', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'admin', { responseType: 'text' });
  }
}
