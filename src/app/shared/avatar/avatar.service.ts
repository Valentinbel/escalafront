import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlClimberProfiles = this.baseUrl + 'climber-profiles/';
  private readonly urlAvatar = this.urlClimberProfiles + 'avatar';
  private readonly httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
    
  constructor(private readonly httpClient: HttpClient) { }

  
  upload(fileConverted: File, userId: number): Observable<any> {
    // TODO Qu'est ce qu'on attend comme observable en reponse? //number ????

    // Créer le FormData
    const formData: FormData = new FormData();
    formData.append('file', fileConverted);
    formData.append("userId", userId.toString());
    //this.httpOptions is contained in the formData

    return this.httpClient.post<string>(this.urlAvatar, formData);
  }

  getFiles(): Observable<any> {
    //TODO revoir ca aussi & le <any>
    return this.httpClient.get(`${this.baseUrl}/file`);
  }
}