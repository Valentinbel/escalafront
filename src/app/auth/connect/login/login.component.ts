import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthStorageService } from '../../auth-storage.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: any = {
    username: null,
    password: null
  };

  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false; //TODO supprimer aussi ?????
  errorMessage: string = ''; // TODO revoir?
  userName: string = '';

  constructor(
    private readonly authService: AuthService, 
    private readonly authStorageService: AuthStorageService,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService){}

  ngOnInit(): void{
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userName = this.authStorageService.getClimberUser().userName;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.authStorageService.setClimberUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.userName = this.authStorageService.getClimberUser().userName;
        this.reloadPage();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.displayErrorSnackBar(this.errorMessage);
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  displayErrorSnackBar(errorMessage: string): void {
    let message = this.translateService.instant('connect.login.error.loginFailed');
    this.snackBarService.add(message + errorMessage, 4000, "error");
  }
}
