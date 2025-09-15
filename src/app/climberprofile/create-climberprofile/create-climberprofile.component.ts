import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, FormsModule} from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../model/enum/language.enum';
import { ClimberuserService } from '../../shared/climberuser.service';
import { ProfileStorageServiceService } from '../profile-storage-service.service';
import { AuthStorageService } from '../../auth/auth-storage.service';
import { AvatarComponent } from "../../shared/avatar/avatar.component";

@Component({
    selector: 'app-create-climberprofile',
    imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule, AvatarComponent],
    templateUrl: './create-climberprofile.component.html',
    styleUrl: './create-climberprofile.component.css'
})

export class CreateClimberprofileComponent implements OnInit{
// FINIR LE PATCH POUR LE RESTE DU PROFILE 
// TODO isLoading
// Changer nom component => Modifier routing comme dans tuto 
// https://jasonwatmore.com/post/2020/09/02/angular-combined-add-edit-create-update-form-example

  profileForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    climberProfileDescription: new FormControl(''),
    languageId: new FormControl(''),
    genderId: new FormControl(''),
    avatar: new FormControl(''),
    notified: new FormControl(''),
  });

  climberProfile: ClimberProfile;
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
    private readonly climberprofileService: ClimberprofileService,
    private readonly climberUserService: ClimberuserService,
    private readonly authStorageService: AuthStorageService,
    private readonly profileStorageService: ProfileStorageServiceService,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService
  ) {}

  // TODO Renommer composant en : add-edit-climberprofile.component.ts
  ngOnInit(): void {
    console.log("history.state: ", history.state);
    if (history.state.userId) {
      this.userId = history.state.userId;
      this.userName = history.state.userName;
      
      if (history.state.profile) {
        this.climberProfile = history.state.profile;
        this.profileId = this.climberProfile.id!;
      }
      
    }

    /* TODO this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;*/

    this.isAddMode = this.climberProfile === undefined;
   
    console.log('climberProfile: ' + JSON.stringify(this.climberProfile));

    this.profileForm = this.formBuilder.group({
      userName: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      climberProfileDescription: [],
      language: [],
      genderId: [],
      notified: [],
      avatar: [],
    });
  
    // TODO Dans une fonction particuliere type retrieve fields
    // TODO Attention à languageId qui ne fonctione pas.
    this.profileForm.get('userName')?.patchValue(this.userName);
    if (!this.isAddMode && this.climberProfile !== undefined) {
      let profileToUpdate: ClimberProfile;
      profileToUpdate = this.profileStorageService.getProfile();
  
      this.profileForm.get('climberProfileDescription')?.patchValue(profileToUpdate.climberProfileDescription);
      this.profileForm.get('languageId')?.patchValue(profileToUpdate.languageId);
      this.languageId = profileToUpdate.languageId!;
      this.profileForm.get('genderId')?.patchValue(profileToUpdate.genderId); 
      this.profileForm.get('avatar')?.patchValue(profileToUpdate.avatar);
      this.profileForm.get('notified')?.patchValue(profileToUpdate.notified);

     /* if (!this.isAddMode) {
        this.userService.getById(this.id)
            .pipe(first())
            .subscribe(x => this.form.patchValue(x));
      }*/
    }

    // TODO : on dira dans la fonction: si !addmode et profile.languageId, alors on utilise ça
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
    this.profileForm.invalid ? this.showErrors() : this.saveForm();
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

  private saveForm(): void {
    this.saveProfile();
    this.saveUserName();
    // TODO: nest l'un dans l'autre ?
  }

  private saveUserName(): void {
    let userName  = this.field['userName'].value;
    console.log(typeof(this.field['userName'].value));

    this.climberUserService.updateClimberUserNameById(this.userId, userName).subscribe({
      next: () => {
        this.authStorageService.setUserName(userName);
      },
      error: (err) => {
        this.displayErrorSnackBar(err.error.message);
      },
    });
  }

  private saveProfile(): void {
    console.log('profileId: ', this.profileId);
    console.log('avatar', this.field['avatar'].value);
    this.climberProfile = {
      id: this.profileId,
      avatar: this.field['avatar'].value,
      genderId: this.field['genderId'].value,
      languageId: this.languageId,
      notified: this.field['notified'].value ?? false,
      climberProfileDescription: this.field['climberProfileDescription'].value,
      climberUserId: this.userId,
    };

    this.climberprofileService.saveClimberProfile(this.climberProfile).subscribe({
      next: (profile: ClimberProfile) => {
        if (profile) {
          console.log(profile);
          this.router.navigate(['../climber-profile'], {relativeTo: this.route}); // TODO: mettre create en enfant de ClimberProfile pour mettre ca: ['../'], {relativeTo: this.route}
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
    this.router.navigate(['../climber-profile'], { relativeTo: this.route });
    //this.dialogRef.close(true);
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }
}
