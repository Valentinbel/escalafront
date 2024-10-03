import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ClimberProfile } from '../model/climberprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ClimberprofileService {
  private readonly baseUrl = 'http://localhost:8080/api/';
  private readonly urlAllClimberProfiles = this.baseUrl + 'climber-profiles';
  private readonly urlClimberProfile = this.baseUrl + 'climber-profile/';

  constructor(private httpClient: HttpClient) { }

  getAllClimberProfiles(): Observable<ClimberProfile[]>{
    return this.httpClient.get<ClimberProfile[]>(this.urlAllClimberProfiles);
  }

  getClimberProfileById(climberProfileId: number): Observable<ClimberProfile> {
    return this.httpClient.get<ClimberProfile>(this.urlClimberProfile + climberProfileId);
  }

  postClimberProfile(climberprofile: ClimberProfile): Observable<ClimberProfile> {
    return this.httpClient.post<ClimberProfile>(this.urlClimberProfile, climberprofile);
  }
}
