import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, FormsModule } from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum  } from '../../model/enum/language.enum';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SnackBarComponent, TranslateModule, FormsModule ],
  templateUrl: './create-climberprofile.component.html',
  styleUrl: './create-climberprofile.component.css'
})
export class CreateClimberprofileComponent {
  climberProfile: ClimberProfile;
  languageList: string[] = [];
  languageMap: Map<string, string>= new Map; 
  languageId: number;

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
    private readonly snackBarService: SnackBarService, 
    private readonly translate: TranslateService) {}

  ngOnInit(){
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
        this.translate.get('lang.'+lang.toLowerCase()).forEach(language => {
          this.languageList.push(language);
          this.languageMap.set(lang.toLowerCase(), language)
        });
      }
    }
    this.translate.get('lang.select').subscribe(el => this.languageList.unshift(el));
  }
   
  useLanguage(language: any): void {
    this.languageMap.forEach((label, code) => {
      if(language === label){
        this.translate.use(code);

        for (let lang in LanguageEnum) {
          if(lang === code.toUpperCase())
            this.languageId = parseInt(LanguageEnum[lang]);
        }
      }
    });
      this.setLanguageList();
  }

  createProfile(): void{
    this.submitted = true;
    this.profileForm.invalid ? this.showErrors() : this.saveProfile();
    console.log("Profile: " + JSON.stringify(this.profileForm.value, null, 2));
  }

  private showErrors(): void { 
    for(const value in this.field){
      if(this.field[value].errors)
        this.snackBarService.add(value, 4000, "error");
    };
  }

  private  saveProfile(){
    this.climberProfile = {
      name : this.field['name'].value, 
      avatar: this.field['avatar'].value,
      genderId : this.field['gender'].value,
      languageId : this.languageId,
      notified : this.field['notified'].value,
      climberProfileDescription : this.field['description'].value,
    };
    console.log("climberProfile to save: " + JSON.stringify(this.climberProfile));
    
     this.climberprofileService.postClimberProfile(this.climberProfile).subscribe(profile => {
      if(profile) {
        console.log(profile);
        this.router.navigate(['../'], {relativeTo: this.route}); 
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
    //this.dialogRef.close(true);
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }
}
