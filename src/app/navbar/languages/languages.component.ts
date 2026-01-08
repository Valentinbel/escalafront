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
  languageId: number;

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
    if (!this.isLoggedIn) {
      this.languageStorageService.setLanguage(this.translate.currentLang);

      console.log("this.selectedLang (not logged in)", this.translate.currentLang);
    }
    else { // isLoggedIn
      console.log("logged in language component");

      let userId: number = this.authStorageService.getUserId();
      this.userService.getLanguageId(userId).subscribe({
        next: responseLanguageId => {
          console.log("responseLanguageId: " + responseLanguageId);
          if (responseLanguageId !== null) {
            this.languageId = responseLanguageId;
          }

        }
      })

      console.log("languageId: " + this.languageId);
      if (!this.languageId) {
        console.log("no language id found, first log, for sure");

        this.languageList.forEach( language => {
          if (language.code === this.selectedLang) {
            this.userService.updateUserLanguage(userId, language.id).subscribe({
              next: () => {
                let message = this.translate.instant('navbar.languages.error');
                console.log("Le message d'erreur: " + message);
                console.log("userLanguage updated");
              },
              error: (err) => {
                let message = this.translate.instant('navbar.languages.error');
                this.snackBarService.add(message, 8000, 'error');
                console.log("Erreur les boys" + message + err);
              },
            });
          }
        })
      }
    }
  }

  onLanguageChange(langCode: string): void {
    this.selectedLang = langCode;
    this.translate.use(langCode);
    //userService.updateLanguageId du user(language.id); + userId
    this.languageStorageService.setLanguage(langCode);
  }
}
