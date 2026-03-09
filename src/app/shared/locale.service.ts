import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DateAdapter} from "@angular/material/core";

@Injectable({
  providedIn: 'root',
})
export class LocaleService {

  constructor(
    private readonly dateAdapter: DateAdapter<any>,
    @Inject(LOCALE_ID) private readonly localeId: string
  ) {}

  // We keep it for now. Should be usefull in the future. Future me: Delete it if it still useless
  setLocale(locale: string): void {
    this.dateAdapter.setLocale(locale);
  }
}
