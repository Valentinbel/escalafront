import { Injectable } from '@angular/core';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {

  constructor() { }

  clean(): void {
    sessionStorage.clear();
  }

  public setProfile(profile: Profile): void {
    sessionStorage.removeItem('profile');
    sessionStorage.setItem('profile', JSON.stringify(profile));
  }

  public getProfile(): any { //TODO Profile
    const profile = sessionStorage.getItem('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return {};
  }
}
