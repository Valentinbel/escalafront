import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../../../../public/i18n/en.json';
import { CommonModule } from '@angular/common';
import {MatFormField} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {Language, SUPPORTED_LANGUAGES} from "../../model/language";
import {AuthStorageService} from "../../auth/auth-storage.service";
import {UserService} from "../user.service";
import {SnackBarService} from "../../shared/snack-bar/snack-bar.service";
import {LanguagesStorageService} from "./languages-storage.service";
import {catchError, Observable, of, switchMap} from "rxjs";

@Component({
  selector: 'app-languages',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, MatFormField, MatSelect, MatOption ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css',
})
export class LanguagesComponent implements OnInit {

  selectedLang: string;
  languageList: Language[] = [];
  isLoggedIn = false;
  userId: number;

  constructor(
    private readonly authStorageService: AuthStorageService,
    private readonly userService: UserService,
    private readonly snackBarService: SnackBarService,
    private readonly languageStorageService: LanguagesStorageService,
    private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setTranslation('en', defaultLanguage); // defaultLanguage as static to avoid loading glitches
    this.translate.setDefaultLang('en'); // fall-back language, that is used if a translation can not be found.

    // gives you the language set in the user's browser or english by default
    let navLang: string = navigator.language.split('-')[0];
    console.log("Browser language: " + navLang);
    this.translate.getLangs().includes(navLang) ? this.translate.use(navLang) : this.translate.use('en');
    this.selectedLang = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.languageList = [...SUPPORTED_LANGUAGES];

    this.isLoggedIn = this.authStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      console.log("logged in language component");

      this.userId = this.authStorageService.getUserId();
      this.userService.getLanguageId(this.userId)
        .pipe(
          switchMap((responseLanguageId):Observable<any> => {
            console.log("responseLanguageId: " + responseLanguageId);
            if (responseLanguageId === null) {
              let message: string = this.translate.instant('navbar.languages.error');
              this.snackBarService.add(message, 8000, 'error');
              console.log("user shoould have a languageId, we have a problem here." + this.userId);
              return of(null)
            }
            else {
              const foundLanguage: Language|undefined = this.languageList.find((lang: Language) => lang.id ===  responseLanguageId);
              console.log("foundLanguage: ", foundLanguage?.label);
              if (foundLanguage !== undefined)
                this.changeLanguage(foundLanguage.code);
              return of(responseLanguageId);
            }

          }),
          catchError(error => {
            console.error('Erreur:', error);
            return of(null); // ou throwError
          })
        )
        .subscribe({
          next: (result) => {
            console.log("result du next", result);
          },
          error: (err) => {
            let message: string = this.translate.instant('navbar.languages.error');
            this.snackBarService.add(message, 8000, 'error');
            console.log("Erreur les boys" + message + err);
          }
      });
    } else { // !isLoggedIn
      this.languageStorageService.setLanguage(this.translate.currentLang);
      console.log("this.selectedLang (not logged in)", this.translate.currentLang);
    }
  }

  onLanguageChange(langCode: string): void {
    this.changeLanguage(langCode);

    console.log(this.userId);
    const foundLanguage: Language|undefined = this.languageList.find((lang: Language) => lang.code ===  this.selectedLang);
    console.log("foundLanguage: ", foundLanguage?.label);
    if (foundLanguage !== undefined)
      this.changeLanguage(foundLanguage.code);
    if (this.userId && foundLanguage?.id !== undefined)
      this.userService.updateUserLanguage(this.userId, foundLanguage.id).subscribe({
        next: () => console.log("language updated on user", this.userId),
        error: (err) => console.log(err)
      });
  }

  private changeLanguage(langCode: string): void {
    this.selectedLang = langCode;
    this.translate.use(langCode);
    this.languageStorageService.setLanguage(langCode);
    console.log("language changed to " + this.selectedLang);
  }
}
