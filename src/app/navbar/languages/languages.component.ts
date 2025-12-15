import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../../../../public/i18n/en.json';
import { CommonModule } from '@angular/common';
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {Language, SUPPORTED_LANGUAGES} from "../../model/language";
import {AuthStorageService} from "../../auth/auth-storage.service";

@Component({
  selector: 'app-languages',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, MatFormField, MatLabel, MatSelect, MatOption ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css',
})
export class LanguagesComponent implements OnInit {

  selectedLang: string;
  languageList: Language[] = [];
  isLoggedIn = false;

  constructor(
    private readonly authStorageService: AuthStorageService,
    private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setTranslation('en', defaultLanguage); // defaultLanguage as static to avoid loading glitches
    this.translate.setDefaultLang('en'); // fall-back language, that is used if a translation can not be found.
    this.selectedLang = this.translate.currentLang || this.translate.defaultLang || 'en';

    // gives you the language set in the user's browser or english by default
    let navLang: string = navigator.language.split('-')[0];
    console.log("Browser language: " + navLang);
    this.translate.getLangs().includes(navLang) ? this.translate.use(navLang) : this.translate.use('en');
  }

  ngOnInit(): void {
    this.languageList = [...SUPPORTED_LANGUAGES];
    console.log(this.languageList);

    this.isLoggedIn = this.authStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      console.log("logged in language component");

      let languageId: number = this.authStorageService.getUser().getLanguageId();
      if (!languageId) {
        console.log("no language id found");
        let userId: number = this.authStorageService.getUser().getId();
        this.languageList.forEach( language => {
          if (this.selectedLang === language.code) {
            //userService.updateLanguageId du user(language.id);
          }
        })
      }


    } else {
      console.log("this.selectedLang (not logged in)", this.selectedLang);
      this.translate.use(this.selectedLang);
    }
  }

  onLanguageChange(langCode: string): void {
    this.selectedLang = langCode;
    this.translate.use(langCode);

    // Optionnel : sauvegarder la préférence
    //localStorage.setItem('selectedLanguage', langCode);
  }
}
