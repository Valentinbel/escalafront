import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn ,FormBuilder, FormControl, 
  FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';
import { Register } from '../../../model/register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  })

  registerModel: Register;
  submitted = false;

  isSuccessful = false;
  isSignUpFailed = false; // TODO Supprimer ??????????
  errorMessage = '';


  constructor(private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userName:['', [ Validators.required, 
                      Validators.minLength(4),
                      Validators.maxLength(20)]],
      email:['', [  Validators.required,
                    Validators.email,
                    Validators.maxLength(50)]],
      password:['',[  Validators.required,
                      Validators.minLength(8),
                      Validators.maxLength(40)]],
      passwordConfirm:['',[ Validators.required,
                            Validators.minLength(8),
                            Validators.maxLength(40)]],
                            
                            
    },{ validators: this.passwordMatchValidator })
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl<FormGroup>): ValidationErrors | null => {
    const password = group.get('password');
    const passwordConfirm = group.get('passwordConfirm');
  
    if (password && passwordConfirm && (password.value !== passwordConfirm.value)) {
      console.log("Password and passwordConfirm doesn't match");
      return { passwordMismatch: true };
    }
    return null;
  };

  get field(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name // TODO mettre juste f
    return this.registerForm.controls;
  }

  submitRegister(): void {
    this.submitted = true;
    this.registerForm.invalid? this.showErrors() : this.saveRegister();
  }

  private showErrors(): void {
    for (const value in this.field) {
      if (this.field[value].errors) {
        let fieldError = this.translateService.instant('form.fieldError');
        this.snackBarService.add(fieldError + value, 8000, 'error');
      } 
    }
    if (this.registerForm.hasError('passwordMismatch')) {
      let passwordMismatch = this.translateService.instant('connect.register.error.passwordMismatch'); //
      this.snackBarService.add(passwordMismatch, 8000, 'error');
    }
  }

  private saveRegister(): void {
    this.registerModel = {
      userName: this.field['userName'].value,
      email: this.field['email'].value,
      password: this.field['password'].value
    };

    this.authService.register(this.registerModel).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        this.isSignUpFailed = true;
        let messageRegister = this.translateService.instant('connect.register.error.registerFailed');
        this.snackBarService.add(messageRegister, 8000, 'error');
      }
    });
  }
}