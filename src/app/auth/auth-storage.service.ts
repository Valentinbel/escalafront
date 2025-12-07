import { effect, Injectable, signal } from '@angular/core';
import { LoginResponse } from '../model/login-response.model';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  // Signal pour le username (juste dans le service)
  private readonly usernameSignal = signal<string>(this.getUserName());
  
  // Lecture seule pour les composants
  readonly username = this.usernameSignal.asReadonly();

  constructor() { 
    // Effect pour synchroniser automatiquement avec localStorage
    effect(() => {
       this.usernameSignal();
    });
  }

  clean(): void {
    sessionStorage.clear();
  }

  public getUser(): any { // TODO Model
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  
  public setUser(user: LoginResponse): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    sessionStorage.setItem('userId', JSON.stringify(user.id));

    this.usernameSignal.set(user.userName);
  }

  public getUserName(): string {
    const user = this.getUser();
    return user.userName;
  }

  public setUserName( userName: string): void {
    const user = this.getUser();
    user.userName = userName;
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    this.usernameSignal.set(user.userName);
  }

  public getUserId(): number {
    const userId = sessionStorage.getItem('userId');
    return userId ? JSON.parse(userId) : 0;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
