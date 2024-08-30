import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ClimberProfile } from '../model/climberprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ClimberprofileService {
  private readonly baseUrl = 'http://localhost:8080/api/';
  private readonly urlGetAllClimberProfiles = this.baseUrl + 'climber-profiles';
  private readonly urlgetClimberProfileById = this.baseUrl + 'climber-profile/';

  constructor(private httpClient: HttpClient) { }

  getAllClimberProfiles(): Observable<ClimberProfile[]>{
    return this.httpClient.get<ClimberProfile[]>(this.urlGetAllClimberProfiles);
  }

  getClimberProfileById(climberProfileId: number): Observable<ClimberProfile> {
    return this.httpClient.get<ClimberProfile>(this.urlgetClimberProfileById + climberProfileId);
  }
}
