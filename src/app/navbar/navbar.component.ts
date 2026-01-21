import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthStorageService } from '../auth/auth-storage.service';
import {Subject, Subscription, takeUntil} from 'rxjs';
import { EventBusService } from '../shared/event-bus.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../shared/snack-bar/snack-bar.service';
import { MessageResponse } from '../model/message-response.model';
import { LanguagesComponent } from './languages/languages.component';
import {AvatarStorageService} from "../shared/avatar/avatar-storage.service";
import {DomSanitizer, SafeStyle, SafeUrl} from "@angular/platform-browser";
import {AvatarService} from "../shared/avatar/avatar.service";
import {NgClass} from "@angular/common";

@Component({
    selector: 'navbar',
  imports: [RouterModule, TranslateModule, LanguagesComponent, NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  // Service injecté != constructor
  authStorageService = inject(AuthStorageService);
  authService = inject(AuthService);
  eventBusService = inject(EventBusService);
  translateService = inject(TranslateService);
  snackBarService = inject(SnackBarService);
  avatarService = inject(AvatarService);
  avatarStorageService = inject(AvatarStorageService);
  sanitizer = inject(DomSanitizer);

  eventBusSub?: Subscription;
  isLoggedIn = false;
  //avatarBackgroundStyle: SafeStyle | null = null;
  objectUrl: string | null = null;
  avatarUrl: SafeUrl | null = null;

  // Accès au signal username (lecture seule)
  readonly userNameSignal = this.authStorageService.username;
  private readonly destroy$ = new Subject<void>();
  private userId: number;

  //avatarBackgroundStyle a mettre comme signal: c'est notre image
  readonly avatarBackgroundStyleSignal = this.avatarStorageService.avatarUrl;
  constructor(){  }

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
    console.log("avatarBackgroundStyleSignal: " + this.avatarBackgroundStyleSignal());
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userId = this.authStorageService.getUserId();
      console.log("is logged in et userId = ", this.userId);
      console.log("getAvatarId ", this.avatarStorageService.getAvatarId());
      //if (this.avatarStorageService.getAvatarId()) {
      // TODO pour éviter d'avoir des erreurs, et fluidifier: if profile (qui sera un signal)
        console.log("si on a l'avatarId");
        this.avatarService.getFile(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (url) => {
              // Nettoyer l'ancienne URL si elle existe
              if (this.objectUrl) {
                URL.revokeObjectURL(this.objectUrl);
              }

              // Stocker l'URL brute
              this.avatarUrl = url;
              console.log("ca rentre ici navbarComponent");
              // Sanitizer pour background-image
              // TODO setAvatar sanitized pour avoir un Signal SafeUrl
              const backgroundImageValue = `url(${url})`;
              this.avatarStorageService.setAvatarUrl(`url(${this.avatarUrl.toString()})`);
              //this.avatarBackgroundStyle = this.sanitizer.bypassSecurityTrustStyle(backgroundImageValue);
              //return this.avatarBackgroundStyle;//
            },
            error: (err) => {
              console.log("Error on retrieving avatar from server");
              console.log(err);
            }
          });
      //}
    }
  }

  logout(): void {
    if (this.isLoggedIn) {
      let userId: number = this.authStorageService.getUserId();
      this.authService.logout(userId).subscribe({
        next: (response: MessageResponse) => {
          console.log(response.message);
          this.authStorageService.clean();
          this.isLoggedIn = false;

          let logoutMessage = this.translateService.instant('navbar.logoutMessage');
          this.snackBarService.add(logoutMessage , 8000, 'error');
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    this.isLoggedIn = false;
  }

  ngOnDestroy(): void {
    // clean subscription
    this.destroy$.next();
    this.destroy$.complete();

    // Libération de la mémoire de l'URL objet
    if (this.avatarUrl) {
      URL.revokeObjectURL(this.avatarUrl.toString());
    }
  }
}
