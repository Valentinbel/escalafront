import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthStorageService } from '../auth-storage.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, TranslateModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {
  isLoggedIn: boolean = false;
  wantLogin: boolean = true;

  constructor(
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService
  ) {}

  ngOnInit(): void{
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.router.navigate(['/climber-profile']);
      this.displayWelcomeSnackBar();
    }
  }

  displayWelcomeSnackBar(): void {
    let userName = this.authStorageService.getClimberUser().userName;
    let message = this.translateService.instant('connect.login.success');
    this.snackBarService.add(message + userName, 4000, 'success');
  }

  displayLogin():void {
    this.wantLogin= true;
  }

  displayRegister(): void {
    this.wantLogin= false;
  }

}
