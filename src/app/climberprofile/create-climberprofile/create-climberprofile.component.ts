import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, FormsModule } from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../model/enum/language.enum';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SnackBarComponent, TranslateModule, FormsModule ],
  templateUrl: './create-climberprofile.component.html',
  styleUrl: './create-climberprofile.component.css'
})
export class CreateClimberprofileComponent {
  climberProfile: ClimberProfile;
  userId: number;
  user: any;
  ////// NETTOYER ////////////////////////////////////////////

  languageList: string[] = [];
  languageMap: Map<string, string>= new Map; 
  languageId: number;
  selectedLang: string;  

  profileForm: FormGroup = new FormGroup({
    name: new FormControl(''),  
    description: new FormControl(''),
    language: new FormControl(''),
    gender: new FormControl(''),
    avatar: new FormControl(''),
    notified: new FormControl(''), 
  });
  submitted = false;

  constructor(
    private readonly router: Router, 
    private readonly route: ActivatedRoute, 
    private readonly formBuilder: FormBuilder, 
    private readonly climberprofileService: ClimberprofileService, 
    private readonly authService : AuthService,
    private readonly snackBarService: SnackBarService, 
    private readonly translateService: TranslateService) {}

  ngOnInit(): void{
    if (history.state.user) {
      this.user = history.state.user;
      this.userId = history.state.userId;
      console.log("on les a? : ", this.user, this.userId);
    }
    this.profileForm = this.formBuilder.group(
      {
        name: ['', 
          [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)]
        ],
        description: [],
        language:[],
        gender: [],
        notified:[],
        avatar:[]
      }
    );
    this.setLanguageList();
  }  

  get field(): { [key: string]: AbstractControl } { // we can get name field in the template using field.name instead of form.controls.name
    return this.profileForm.controls;
  }

  private setLanguageList() {
    this.languageList = []; 
    this.languageMap.clear();
    
    for (let lang in LanguageEnum) {
      if(isNaN(Number(lang))) {
        this.translateService.get('lang.'+lang.toLowerCase()).forEach(language => {
          this.languageList.push(language);
          this.languageMap.set(lang.toLowerCase(), language);
          if(lang.toLowerCase() === this.translateService.currentLang){
            this.selectedLang = this.translateService.instant('lang.' + lang.toLowerCase());
            this.getLanguageId(lang.toLowerCase());
          }
        });
      }
    }

   /* this.translate.get('lang.'+ this.translate.currentLang).subscribe(currentLanguage => {
      this.selectedLang = currentLanguage;
      console.log(this.selectedLang);
    });*/
  }
   
  useLanguage(language: any): void {
    this.languageMap.forEach((label, code) => {
      if(language === label){
        this.translateService.use(code);
        this.selectedLang = this.translateService.instant('lang.'+code);
        console.log(this.selectedLang);
        this.getLanguageId(code);
      }
    });
      this.setLanguageList();
  }

  private getLanguageId(shortCode: string): void {
    for (let lang in LanguageEnum) {
      if(lang === shortCode.toUpperCase())
        this.languageId = parseInt(LanguageEnum[lang]);
    }
  }

  createProfile(): void{
    this.submitted = true;
    this.profileForm.invalid ? this.showErrors() : this.saveProfile();
    console.log("Profile: " + JSON.stringify(this.profileForm.value, null, 2));
  }

  private showErrors(): void { 
    for(const value in this.field){
      if(this.field[value].errors) {
        let fieldError = this.translateService.instant('profile.edit.fieldError');
        this.snackBarService.add(fieldError + value, 4000, "error");
      }
    };
  }

  private  saveProfile(){
    this.climberProfile = {
      profileName : this.field['name'].value, 
      avatar: this.field['avatar'].value,
      genderId : this.field['gender'].value,
      languageId : this.languageId,
      notified : this.field['notified'].value !== null? true : false,
      climberProfileDescription : this.field['description'].value,
      //climberUser: this.userId
    };
    //alert(JSON.stringify(this.climberProfile));
    //console.log("climberProfile to save: " + JSON.stringify(this.climberProfile));
    
     this.climberprofileService.postClimberProfile(this.climberProfile).subscribe(profile => {
      if(profile) {
        console.log(profile);
        this.user.climberProfile = profile.id;
        alert(this.user.climberProfile);
        this.authService.updateClimberUser(this.user.id, this.user.climberProfile).subscribe(updatedUser => {
          alert("On a updated le user:" + updatedUser);
        });
        this.router.navigate(['../climber-profile'], {relativeTo: this.route}); // TODO: mettre create en enfant de ClimberProfile pour mettre ca: ['../'], {relativeTo: this.route}
      }
    },
    /*error => {
      let message = this.translateService.instant('connect.login.error.loginFailed');
      this.snackBarService.add(message , 4000, "error");
    }*/
   );
  }

  cancel(): void {
    this.router.navigate(['../climber-profile'], {relativeTo: this.route});
    //this.dialogRef.close(true);
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }
}
