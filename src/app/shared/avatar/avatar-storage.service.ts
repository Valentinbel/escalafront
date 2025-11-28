import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarStorageService {

  constructor() { }

  public setAvatarId(avatarId: number): void {
    sessionStorage.removeItem('avatarId');
    sessionStorage.setItem('avatarId', JSON.stringify(avatarId));
  }

  public getAvatarId(): number {
    const avatarId = sessionStorage.getItem('avatarId');
    return avatarId ? JSON.parse(avatarId) : 0;
  }
}
