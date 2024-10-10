import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SnackBarComponent } from './shared/snack-bar/snack-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../../public/i18n/en.json';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterModule, SnackBarComponent, TranslateModule ], //RouterOutlet
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'escalafront';

  constructor(private readonly translate: TranslateService){
    this.translate.addLangs(['fr', 'en']);
    this.translate.setTranslation('en', defaultLanguage); // defaultLanguage as static to avoid loading glitches
    this.translate.setDefaultLang('en'); // fall-back language, that is used if a translation can not be found.
    
    // gives you the language set in the user's browser or english by default
    let navLang: string = navigator.language.split('-')[0];
    this.translate.getLangs().includes(navLang) ? this.translate.use(navLang) : this.translate.use('en');
  }
}
