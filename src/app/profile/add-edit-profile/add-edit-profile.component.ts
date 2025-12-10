import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, FormsModule} from '@angular/forms';
import { ProfileService } from '../profile.service';
import { CommonModule } from '@angular/common';
import { Profile } from '../../model/profile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../model/enum/language.enum';
import { ProfileStorageService } from '../profile-storage.service';
import { AuthStorageService } from '../../auth/auth-storage.service';
import { AvatarComponent } from "../../shared/avatar/avatar.component";

@Component({
    selector: 'app-add-edit-profile',
    imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule, AvatarComponent],
    templateUrl: './add-edit-profile.component.html',
    styleUrl: './add-edit-profile.component.css'
})

export class AddEditProfileComponent implements OnInit{
// TODO isLoading
// https://jasonwatmore.com/post/2020/09/02/angular-combined-add-edit-create-update-form-example

  profileForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    profileDescription: new FormControl(''),
    languageId: new FormControl(''),
    genderId: new FormControl(''),
    avatar: new FormControl(''),
    isNotified: new FormControl(''),
  });

  profile: Profile;
  submitted = false;
  isAddMode: boolean;

  userId: number;
  languageList: string[] = [];
  languageMap: Map<string, string> = new Map();
  languageId: number;
  profileId: number;
  selectedLang: string;
  userName: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly authStorageService: AuthStorageService,
    private readonly profileStorageService: ProfileStorageService,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (history.state.userId) {
      this.userId = history.state.userId;
      this.userName = history.state.userName;
      
      if (history.state.profile) {
        this.profile = history.state.profile;
        this.profileId = this.profile.id!;
      }
    }

    /* TODO this.id = this.route.snapshot.params['id']; (???)
        this.isAddMode = !this.id;*/

    this.isAddMode = this.profile === undefined;

    this.profileForm = this.formBuilder.group({
      userName: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      profileDescription: [],
      language: [],
      genderId: [],
      isNotified: [],
      avatar: [],
    });
  
    // TODO Dans une fonction particuliere type retrieve fields
    // TODO Attention à languageId qui ne fonctione pas.
    this.profileForm.get('userName')?.patchValue(this.userName);
    if (!this.isAddMode && this.profile !== undefined) {
      let profileToUpdate: Profile;
      profileToUpdate = this.profileStorageService.getProfile();
  
      this.profileForm.get('profileDescription')?.patchValue(profileToUpdate.profileDescription);
      this.profileForm.get('languageId')?.patchValue(profileToUpdate.languageId);
      this.languageId = profileToUpdate.languageId!;
      this.profileForm.get('genderId')?.patchValue(profileToUpdate.genderId);
      this.profileForm.get('isNotified')?.patchValue(profileToUpdate.isNotified);
    }

    // TODO : on dira dans la fonction: si !addmode et profile.languageId, alors on utilise ça
    this.setLanguageList();
  }

  get field(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name
    return this.profileForm.controls;
  }

  private setLanguageList(): void {
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

  useLanguage(language: any): void { // TODO type
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
    console.log('profileId: ', this.profileId);
    console.log('avatar', this.field['avatar'].value);
    this.profile = {
      id: this.profileId,
      userName: this.field['userName'].value,
      genderId: this.field['genderId'].value,
      languageId: this.languageId,
      isNotified: this.field['isNotified'].value ?? false,
      profileDescription: this.field['profileDescription'].value,
      userId: this.userId,
    };
    console.log(this.profile);

    this.profileService.saveProfile(this.profile).subscribe({
      next: (profile: Profile) => {
        if (profile) {
          console.log("retour du back saveProfile: " + JSON.stringify(profile));
          if (profile.userName) 
            this.authStorageService.setUserName(profile.userName);
        
          this.router.navigate(['../searches'], {relativeTo: this.route});
        }
      },
      error: (err) => {
        this.displayErrorSnackBar(err.error.message);
      },
    });
  }

  displayErrorSnackBar(errorMessage: string): void {
    console.log(errorMessage);
    let messageLogin = this.translateService.instant('connect.login.error.loginFailed');
    let messageSave = this.translateService.instant('profile.edit.saveError');
    this.snackBarService.add(messageLogin, 8000, 'error');
    this.snackBarService.add(messageSave, 8000, 'error');

    //TODO Faire comme ca dans les autres endroits: login, register et où il y a d'autres subscribe. 
  }

  cancelProfile(): void {
    this.router.navigate(['../profile'], { relativeTo: this.route });
    //this.dialogRef.close(true);
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }
}
