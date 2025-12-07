import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly baseUrl = 'http://localhost:8085/api/';
  private readonly urlProfiles = this.baseUrl + 'profiles';
  private readonly urlProfileByUser = this.urlProfiles + '/users/';

  constructor(private readonly httpClient: HttpClient) { }

  getProfileByUserId(profileId: number): Observable<Profile>{
    return this.httpClient.get<Profile>(this.urlProfileByUser + profileId);
  }

  saveProfile(profile: Profile): Observable<Profile> {
    return this.httpClient.post(this.urlProfiles, profile);
  }
}
