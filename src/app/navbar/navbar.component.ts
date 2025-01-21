import { Component } from '@angular/core';
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
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  eventBusSub?: Subscription;
  isLoggedIn = false;
  userName: string;
  
  constructor(
    private readonly authService: AuthService, 
    private readonly authStorageService: AuthStorageService,
    private readonly eventBusService: EventBusService,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService,
  ){}

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userName = this.authStorageService.getUserName();
    }
  }

  logout(): void {
    if (this.isLoggedIn) {
      let userId = this.authStorageService.getClimberUserId();
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
  }
}
