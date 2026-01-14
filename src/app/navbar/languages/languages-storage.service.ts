import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguagesStorageService {

  public setLanguage(language: string): void {
    sessionStorage.removeItem('language');
    sessionStorage.setItem('language', language);
  }

  public getLanguage(): string | null {
    return sessionStorage.getItem('language');
  }
}
