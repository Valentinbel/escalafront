import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {DateAdapter} from "@angular/material/core";
import {DateTime} from "luxon";
import {LanguagesStorageService} from "../navbar/languages/languages-storage.service";

@Injectable({
  providedIn: 'root',
})
export class LocaleService {

  constructor(
    private readonly languagesStorageService: LanguagesStorageService,
    private readonly translateService: TranslateService,
    private readonly dateAdapter: DateAdapter<any>,
    @Inject(LOCALE_ID) private readonly localeId: string
  ) {}

  setLocale(locale: string): void {
    this.dateAdapter.setLocale(locale);
  }

  getCurrentLocale(): string {
    this.languagesStorageService.getLanguage()
    let language = this.languagesStorageService.getLanguage();
    if (language !== null)
      return language;
    return this.translateService.currentLang;
  }

  // Format pour l'affichage
  formatDateTime(date: Date | null, time: string | null): string {
    if (!date || !time) return '';

    //TODO: CLEAN ça
    //const locale = this.getCurrentLocale();
    //const [hours, minutes] = time.split(':');

    const dateTime = DateTime.fromJSDate(date)
      //.set({ hour: Number.parseInt(hours), minute: Number.parseInt(minutes) })
      //.setLocale(locale);

    return dateTime.toLocaleString(DateTime.DATETIME_SHORT);
  }

  // Format pour l'affichage de la date seule
  formatDate(date: Date | null): string {
    if (!date) return '';
    return DateTime.fromJSDate(date)
      .setLocale(this.getCurrentLocale())
      .toLocaleString(DateTime.DATE_SHORT);
  }

  // Format pour l'affichage de l'heure seule
  formatTime(time: string | null): string {
    if (!time) return '';
    const locale = this.getCurrentLocale();
    const [hours, minutes] = time.split(':');

    return DateTime.fromObject({ hour: Number.parseInt(hours), minute: Number.parseInt(minutes) })
      .setLocale(locale)
      .toLocaleString(DateTime.TIME_24_SIMPLE);
  }
}
