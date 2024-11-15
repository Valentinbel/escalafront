import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user'; // Clé symétrique? 

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveClimberUser(climberUser: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(climberUser));
  }

  public getClimberUser(): any {
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
