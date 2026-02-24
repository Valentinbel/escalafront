import {effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguagesStorageService {

  // Signal only for service
  private readonly languageSignal = signal<string>(this.getLanguage());

  // ReadOnly for Components
  readonly language = this.languageSignal.asReadonly();

  constructor() {
    // Effect to synchronize automatically with localStorage
    effect(() => {
      this.languageSignal();
    });
  }

  public setLanguage(language: string): void {
    sessionStorage.removeItem('language');
    sessionStorage.setItem('language', language);
    this.languageSignal.set(language);
  }

  public getLanguage(): any {
    return sessionStorage.getItem('language');
  }
}
