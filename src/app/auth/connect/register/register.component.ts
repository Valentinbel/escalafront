import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn ,FormBuilder, FormControl,
  FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';
import { Register } from '../../../model/register.model';
import { MessageResponse } from '../../../model/message-response.model';
import {LanguagesStorageService} from "../../../navbar/languages/languages-storage.service";
import {Language, SUPPORTED_LANGUAGES} from "../../../model/language";

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  registerModel: Register;
  submitted = false;
  isSuccessful = false;
  errorMessage = '';

  constructor(private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly snackBarService: SnackBarService,
    private readonly languageStorageService: LanguagesStorageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userName:['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)]],
      email:['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)]],
      password:['',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40)]],
      passwordConfirm:['',[
        Validators.required,
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

  get f(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name
    return this.registerForm.controls;
  }

  submitRegister(): void {
    this.submitted = true;
    this.registerForm.invalid? this.showErrors() : this.saveRegister();
  }

  private showErrors(): void {
    for (const value in this.f) {
      if (this.f[value].errors) {
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
    let languageId: number = this.getLanguageId();
    this.registerModel = {
      userName: this.f['userName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      languageId: languageId
    };

    this.authService.register(this.registerModel).subscribe({
      next: (response: MessageResponse) => {
        console.log(response.message);
        this.isSuccessful = true;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        let messageRegister = this.translateService.instant('connect.register.error.registerFailed');
        this.snackBarService.add(messageRegister, 8000, 'error');
      }
    });
  }

  private getLanguageId(): number {
    let languageCode: string|null = this.languageStorageService.getLanguage();
    let languageList: Language[] = [...SUPPORTED_LANGUAGES];
    const foundLanguage = languageList.find((lang: Language) => lang.code === languageCode);
    return foundLanguage ? foundLanguage.id : 0;
  }
}
