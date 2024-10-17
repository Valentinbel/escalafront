import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthStorageService } from '../auth-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: any = {
    username: null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private readonly authService: AuthService, private readonly authStorageService: AuthStorageService){}

  ngOnInit(): void{
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.authStorageService.getClimberUser().roles;
      console.log("logged in: ", this.isLoggedIn);
      console.log("roles: ", this.roles);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.authStorageService.saveClimberUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.authStorageService.getClimberUser().roles;
        console.log("roles on Submit: ", this.roles);
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
