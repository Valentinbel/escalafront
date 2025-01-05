import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, FormsModule} from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../model/enum/language.enum';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './create-climberprofile.component.html',
  styleUrl: './create-climberprofile.component.css',
})

export class CreateClimberprofileComponent {

  profileForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    language: new FormControl(''),
    gender: new FormControl(''),
    avatar: new FormControl(''),
    notified: new FormControl(''),
  });

  climberProfile: ClimberProfile;
  submitted = false;

  userId: number;
  languageList: string[] = [];
  languageMap: Map<string, string> = new Map();
  languageId: number;
  profileId: number;
  selectedLang: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly climberprofileService: ClimberprofileService,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (history.state.userId) {
      this.userId = history.state.userId;
      this.profileId = history.state.profileId;
    }

    this.profileForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [],
      language: [],
      gender: [],
      notified: [],
      avatar: [],
    });
    this.setLanguageList();
  }

  get field(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name
    return this.profileForm.controls;
  }

  private setLanguageList() {
    this.languageList = [];
    this.languageMap.clear();

    for (let lang in LanguageEnum) {
      if (isNaN(Number(lang))) {
        this.translateService.get('lang.' + lang.toLowerCase()).forEach((language) => {
          this.languageList.push(language);
          this.languageMap.set(lang.toLowerCase(), language);
          if (lang.toLowerCase() === this.translateService.currentLang) {
            this.selectedLang = this.translateService.instant(
              'lang.' + lang.toLowerCase()
            );
            this.getLanguageId(lang.toLowerCase());
          }
        });
      }
    }
  }

  useLanguage(language: any): void {
    this.languageMap.forEach((label, code) => {
      if (language === label) {
        this.translateService.use(code);
        this.selectedLang = this.translateService.instant('lang.' + code);
        console.log(this.selectedLang);
        this.getLanguageId(code);
      }
    });
    this.setLanguageList();
  }

  private getLanguageId(shortCode: string): void {
    for (let lang in LanguageEnum) {
      if (lang === shortCode.toUpperCase())
        this.languageId = parseInt(LanguageEnum[lang]);
    }
  }

  submitProfile(): void {
    this.submitted = true;
    this.profileForm.invalid ? this.showErrors() : this.saveProfile();
    console.log('Profile: ' + JSON.stringify(this.profileForm.value, null, 2));
  }

  private showErrors(): void {
    for (const value in this.field) {
      if (this.field[value].errors) {
        let fieldError = this.translateService.instant('form.fieldError');
        this.snackBarService.add(fieldError + value, 8000, 'error');
      }
    }
  }

  private saveProfile(): void {
    this.climberProfile = {
      id: this.profileId,
      profileName: this.field['name'].value,
      avatar: this.field['avatar'].value,
      genderId: this.field['gender'].value,
      languageId: this.languageId,
      notified: this.field['notified'].value ?? false,
      climberProfileDescription: this.field['description'].value,
      climberUserId: this.userId,
    };

    this.climberprofileService.postClimberProfile(this.climberProfile).subscribe({
      next: (profile) => {
        if (profile) {
          console.log(profile);
          this.router.navigate(['../climber-profile'], {relativeTo: this.route}); // TODO: mettre create en enfant de ClimberProfile pour mettre ca: ['../'], {relativeTo: this.route}
        }
      },
      error: () => {
        let messageLogin = this.translateService.instant('connect.login.error.loginFailed');
        let messageSave = this.translateService.instant('profile.edit.saveError');
        this.snackBarService.add(messageLogin, 8000, 'error');
        this.snackBarService.add(messageSave, 8000, 'error');
      },
    });
  }

  cancelProfile(): void {
    this.router.navigate(['../climber-profile'], { relativeTo: this.route });
    //this.dialogRef.close(true);
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }
}
