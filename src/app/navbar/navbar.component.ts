import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthStorageService } from '../auth/auth-storage.service';
import { Subscription } from 'rxjs';
import { EventBusService } from '../shared/event-bus.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../shared/snack-bar/snack-bar.service';
import { MessageResponse } from '../model/message-response.model';

@Component({
    selector: 'navbar',
    imports: [RouterModule, TranslateModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  eventBusSub?: Subscription;
  isLoggedIn = false;

  // Service injecté != constructor
  authStorageService = inject(AuthStorageService);
  authService = inject(AuthService);
  eventBusService = inject(EventBusService);
  translateService = inject(TranslateService)
  snackBarService = inject(SnackBarService);
  
  // Accès au signal username (lecture seule)
  readonly userNameSignal = this.authStorageService.username;

  constructor(){}

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  logout(): void {
    if (this.isLoggedIn) {
      let userId = this.authStorageService.getUserId();
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
}
