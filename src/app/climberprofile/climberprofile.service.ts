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
  private readonly urlClimberProfile = this.baseUrl + 'climber-profile/';
  constructor(private httpClient: HttpClient) { }

  getAllClimberProfiles(): Observable<ClimberProfile[]>{
    return this.httpClient.get<ClimberProfile[]>(this.urlGetAllClimberProfiles);
  }

  getClimberProfileById(climberProfileId: number): Observable<ClimberProfile> {
    return this.httpClient.get<ClimberProfile>(this.urlClimberProfile + climberProfileId);
  }

  // verifier dans TIG que la nomenclature marche.
  postClimberProfile(climberprofile: ClimberProfile) {
    return this.httpClient.post<ClimberProfile>(this.urlClimberProfile, climberprofile);
  }
}
