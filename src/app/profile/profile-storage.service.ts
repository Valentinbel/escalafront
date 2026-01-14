import { Injectable } from '@angular/core';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {

  public setProfile(profile: Profile): void {
    sessionStorage.removeItem('profile');
    sessionStorage.setItem('profile', JSON.stringify(profile));
  }

  public getProfile(): Profile { //TODO Profile
    const profile = sessionStorage.getItem('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return {};
  }
}
