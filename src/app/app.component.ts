import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SnackBarComponent } from './shared/snack-bar/snack-bar.component';
import { AuthStorageService } from './auth/auth-storage.service';
import { AuthService } from './auth/auth.service';
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
  title = 'pinya';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(
    private readonly authService: AuthService, 
    private readonly authStorageService: AuthStorageService, 
    private readonly translate: TranslateService){
      this.translate.addLangs(['fr', 'en']);
      this.translate.setTranslation('en', defaultLanguage); // defaultLanguage as static to avoid loading glitches
      this.translate.setDefaultLang('en'); // fall-back language, that is used if a translation can not be found.
    
      // gives you the language set in the user's browser or english by default
      let navLang: string = navigator.language.split('-')[0];
      this.translate.getLangs().includes(navLang) ? this.translate.use(navLang) : this.translate.use('en');
    }

  ngOnInit(): void {
    this.isLoggedIn = this.authStorageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.authStorageService.getClimberUser();
      this.roles = user.roles;
      console.log(" user from Storage : ", user);

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    } else console.log("NOT LOGGED IN")
    /*console.log("Salut les amis");
    this.climberprofileService.getClimberProfiles().subscribe((climberProfile) => console.log("getClimberProfiles: " , climberProfile));

    this.climberprofileService.getClimberProfileById(1).subscribe((climberProfile) => console.log("getClimberProfileById(1): ", climberProfile));*/
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.authStorageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
