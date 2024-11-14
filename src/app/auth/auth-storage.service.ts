import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  clean(): void {
    sessionStorage.clear();
  }

  public setClimberUser(climberUser: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(climberUser));
  }

  public getClimberUser(): any {
    const climberUser = sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return JSON.parse(climberUser);
    }
    return {};
  }

  public getProfileId(): number {
    const profileId = sessionStorage.getItem('profileId');
    return profileId ? JSON.parse(profileId) : 0;
  }

  public setProfileId(profileId: number): void {
    sessionStorage.setItem('profileId', JSON.stringify(profileId));
  }

  public isLoggedIn(): boolean {
    const climberUser = window.sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return true;
    }
    return false;
  }
}
