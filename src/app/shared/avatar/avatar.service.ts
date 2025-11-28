import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlAvatar = this.baseUrl + 'avatar/';

  constructor(
    private readonly httpClient: HttpClient, 
    private sanitizer: DomSanitizer
  ) { }

  getAvatarId(userId: number): Observable<number> {
    return this.httpClient.get<number>(this.urlAvatar + userId + '/id' );
  }

  getFile(userId: number): Observable<SafeUrl> {
    return this.httpClient.get(this.urlAvatar + userId, {
        responseType: 'blob', // Important pour récupérer des données binaires
        observe: 'response'
      }).pipe(
        map(response => {
          const blob = response.body as Blob;
          return URL.createObjectURL(blob);
        })
      );
  }

  upload(fileConverted: File, userId: number): Observable<any> {
    // Créer le FormData
    const formData: FormData = new FormData();
    formData.append('file', fileConverted);
    formData.append("userId", userId.toString());
    //httpOptions is contained in the formData

    return this.httpClient.post<string>(this.urlAvatar, formData);
  }
}