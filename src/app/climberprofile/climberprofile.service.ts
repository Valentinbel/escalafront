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
  private readonly urlClimberProfileByclimberUser = this.urlClimberProfiles + '/climber-users/';

  constructor(private readonly httpClient: HttpClient) { }

  getProfileByUserId(climberProfileId: number): Observable<ClimberProfile>{
    return this.httpClient.get<ClimberProfile>(this.urlClimberProfileByclimberUser + climberProfileId);
  }

  postClimberProfile(climberprofile: ClimberProfile): Observable<ClimberProfile> {
    return this.httpClient.post(this.urlClimberProfiles, climberprofile);
  }
}
