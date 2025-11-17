import { Injectable } from '@angular/core';
import { ClimberProfile } from '../model/climberprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {

  constructor() { }

  clean(): void {
    sessionStorage.clear();
  }

  public setProfile(profile: ClimberProfile): void {
    sessionStorage.removeItem('profile');
    sessionStorage.setItem('profile', JSON.stringify(profile));
  }

  public getProfile(): any { //ClimberProfile
    const profile = sessionStorage.getItem('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return {};
  }
}
