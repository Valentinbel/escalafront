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
    this.translate.use(this.translate.getBrowserLang() ?? "en"); // gives you the language set in the user's browser
  }

  ngOnInit(){
    /*
    console.log("Salut les amis");
    this.climberprofileService.getAllClimberProfiles().subscribe((climberProfile) => console.log("getAllClimberProfiles: " , climberProfile));
    this.climberprofileService.getClimberProfileById(1).subscribe((climberProfile) => console.log("getClimberProfileById(1): ", climberProfile));*/
  }
}
