import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SnackBarComponent } from './shared/snack-bar/snack-bar.component';
import { AuthStorageService } from './auth/auth-storage.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterModule, SnackBarComponent ], //RouterOutlet
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
    private readonly authStorageService: AuthStorageService){}

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
