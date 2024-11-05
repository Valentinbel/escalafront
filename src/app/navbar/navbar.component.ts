import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthStorageService } from '../auth/auth-storage.service';
import { Subscription } from 'rxjs';
import { EventBusService } from '../shared/event-bus.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  eventBusSub?: Subscription;
  isLoggedIn = false;
  
  constructor(
    private readonly authService: AuthService, 
    private readonly authStorageService: AuthStorageService,
    private readonly eventBusService: EventBusService
  ){}

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
    console.log(this.authStorageService.isLoggedIn().valueOf())
  }

  logout(): void {
    console.log("Logout function");
    this.authStorageService.clean();
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.authStorageService.clean();
        this.isLoggedIn = false;
      },
      error: err => {
        console.log(err);
      }
    });
    window.location.reload();
  }

}
