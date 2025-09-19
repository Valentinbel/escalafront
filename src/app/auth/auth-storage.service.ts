import { Injectable } from '@angular/core';
import { LoginResponse } from '../model/login-response.model';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  clean(): void {
    sessionStorage.clear();
  }

  public getClimberUser(): any { // TODO Model
    const climberUser = sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return JSON.parse(climberUser);
    }
    return {};
  }
  
  public setClimberUser(climberUser: LoginResponse): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(climberUser));
    sessionStorage.setItem('climberUserId', JSON.stringify(climberUser.id) )
  }

  public getUserName(): string {
    const climberUser = this.getClimberUser();
    return climberUser.userName;
  }

  public setUserName( userName: string): void {
    const climberUser = this.getClimberUser();
    climberUser.userName = userName;
    sessionStorage.setItem('USER_KEY', JSON.stringify(climberUser));
  }


  public getClimberUserId(): number {
    const climberUserId = sessionStorage.getItem('climberUserId');
    return climberUserId ? JSON.parse(climberUserId) : 0;
  }

  public isLoggedIn(): boolean {
    const climberUser = window.sessionStorage.getItem(USER_KEY);
    if (climberUser) {
      return true;
    }
    return false;
  }
}
