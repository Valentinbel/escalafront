import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlAvatar = this.baseUrl + 'avatar/';

  constructor(private readonly httpClient: HttpClient) { }

  
  upload(fileConverted: File, userId: number): Observable<any> {
    // Créer le FormData
    const formData: FormData = new FormData();
    formData.append('file', fileConverted);
    formData.append("userId", userId.toString());
    //this.httpOptions is contained in the formData

    return this.httpClient.post<string>(this.urlAvatar, formData);
  }

  getFile(userId: number): Observable<any> {
    return this.httpClient.get<any>(this.urlAvatar + userId);
  }
}