import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SnackBarComponent } from './shared/snack-bar/snack-bar.component';
import { AuthStorageService } from './auth/auth-storage.service';
import { AuthService } from './auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../../public/i18n/en.json';
import { MessageResponse } from './model/message-response.model';
import { ContactComponent } from "./contact/contact.component";
import { AvatarService } from './shared/avatar/avatar.service';
import { AvatarStorageService } from './shared/avatar/avatar-storage.service';
import { SnackBarService } from './shared/snack-bar/snack-bar.service';

@Component({
    selector: 'app-root',
    imports: [NavbarComponent, RouterModule, SnackBarComponent, TranslateModule, ContactComponent], //RouterOutlet
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'pinya';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  userId: number;

  constructor(
    private readonly authService: AuthService, 
    private readonly avatarService: AvatarService,
    private readonly authStorageService: AuthStorageService, 
    private readonly avatarStorageService: AvatarStorageService,
    private readonly snackBarService: SnackBarService,
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
      this.userId = user.id; 
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.getAvatarId();
    } 
    else console.log("NOT LOGGED IN")
  }

  private getAvatarId(): void {
    this.avatarService.getAvatarId(this.userId).subscribe( {
        next: (avatarId: number) => {
          this.avatarStorageService.setAvatarId(avatarId);
        },
        error: (err) => {
          let message = this.translate.instant('avatar.getError');
          this.snackBarService.add(message, 8000, 'error');
          console.log("Erreur les boys" + message + err);
        }
    });
  }

  logout(): void {
    if (this.isLoggedIn) {
      this.authService.logout(this.userId).subscribe({
        next: (response: MessageResponse) => {
          console.log(response.message);
          this.authStorageService.clean();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }   
}
