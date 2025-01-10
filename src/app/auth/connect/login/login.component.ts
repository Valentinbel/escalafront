import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthStorageService } from '../../auth-storage.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';
import { LoginResponse } from '../../../model/login-response.model';
import { Login } from '../../../model/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted = false;
  loginModel: Login;

  isLoggedIn: boolean = false;
  errorMessage: string = ''; // TODO revoir?
  userName: string = '';

  constructor(
    private readonly authService: AuthService, 
    private readonly authStorageService: AuthStorageService,
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService){}

  ngOnInit(): void{
    if (this.authStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userName = this.authStorageService.getClimberUser().userName;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [ 
        Validators.required, 
        Validators.email,
        Validators.maxLength(50)]],
      password: ['', [ 
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40)]]
    });
  }

  get f(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name 
    return this.loginForm.controls;
  }

  submitLogin(): void {
    this.submitted = true;
    this.loginForm.invalid ? this.showErrors() : this.login();
  }

  private showErrors(): void {
    for (const value in this.f) {
      if (this.f[value].errors) {
        let fieldError = this.translateService.instant('form.fieldError');
        this.snackBarService.add(fieldError + value, 8000, 'error');
      } 
    }
  }

  private login(): void {
    this.loginModel = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(this.loginModel).subscribe({
      next: (response: LoginResponse) => {
        this.authStorageService.setClimberUser(response);
        this.isLoggedIn = true;
        this.userName = this.authStorageService.getClimberUser().userName;
        this.reloadPage();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.displayErrorSnackBar(this.errorMessage);
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  displayErrorSnackBar(errorMessage: string): void {
    let message = this.translateService.instant('connect.login.error.loginFailed');
    this.snackBarService.add(message + errorMessage, 8000, 'error');
  }
}
