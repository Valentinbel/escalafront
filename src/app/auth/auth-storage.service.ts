import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveClimberUser(climberUser: any): void { // TODO Ajouter climberUser
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(climberUser));
  }

  public getClimberUser(): any { // TODO Ajouter climberUser
    const climberUser = window.sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return JSON.parse(climberUser);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const climberUser = window.sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return true;
    }

    return false;
  }
}
