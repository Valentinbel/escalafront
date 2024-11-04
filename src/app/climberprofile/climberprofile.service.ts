import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClimberProfile } from '../model/climberprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ClimberprofileService {
  private readonly baseUrl = 'http://localhost:8080/api/';
  private readonly urlClimberProfiles = this.baseUrl + 'climber-profiles';

  constructor(private readonly httpClient: HttpClient) { }

  getClimberProfiles(): Observable<ClimberProfile[]> {
    return this.httpClient.get<ClimberProfile[]>(this.urlClimberProfiles);
  }

  getClimberProfileById(climberProfileId: number): Observable<ClimberProfile>{
    return this.httpClient.get<ClimberProfile>(this.urlClimberProfiles + '/' +climberProfileId );
  }

  postClimberProfile(climberprofile: ClimberProfile): Observable<ClimberProfile> {
    return this.httpClient.post(this.urlClimberProfiles, climberprofile);
  }
}
