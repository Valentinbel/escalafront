import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthStorageService } from '../auth/auth-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private readonly authService: AuthService, private readonly authStorageService: AuthStorageService){}

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
