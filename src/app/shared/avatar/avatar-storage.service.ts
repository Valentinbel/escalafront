import {effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarStorageService {

  // Signal pour le username (juste dans le service)
  private readonly avatarSignal = signal<string>(this.getAvatarUrl());

  // Lecture seule pour les composants
  readonly avatarUrl = this.avatarSignal.asReadonly();

  constructor() {
    // Effect pour synchroniser automatiquement avec localStorage
    effect(() => {
      this.avatarSignal();
    });
  }

  public setAvatarId(avatarId: number): void {
    sessionStorage.removeItem('avatarId');
    sessionStorage.setItem('avatarId', JSON.stringify(avatarId));
  }

  public getAvatarId(): number {
    const avatarId = sessionStorage.getItem('avatarId');
    return avatarId ? JSON.parse(avatarId) : 0;
  }

  public setAvatarUrl(avatarUrl: string): void {
    sessionStorage.removeItem('avatarUrl');
    sessionStorage.setItem('avatarUrl', avatarUrl);
    this.avatarSignal.set(avatarUrl);
  }

  public getAvatarUrl(): any {
    return sessionStorage.getItem('avatarUrl');
  }
}
