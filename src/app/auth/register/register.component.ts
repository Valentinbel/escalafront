import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestService } from '../test.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule
    //,    BrowserModule // a quoi servent tous ces modules '? Documenter
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: any = {
    userName: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly testService: TestService) {
    this.testService.getPublicContent().subscribe(
      data => console.log("Coucou   " , data)
      //{next:data => {console.log(data);}}
    )
   }

  onSubmit(): void {
    const { userName, email, password } = this.form;

    this.authService.register(userName, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
