import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SnackBarComponent],
  templateUrl: './create-climberprofile.component.html',
  styleUrl: './create-climberprofile.component.css'
})
export class CreateClimberprofileComponent {
  climberProfile: ClimberProfile;

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
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private climberprofileService: ClimberprofileService, 
    private snackBarService: SnackBarService) {}

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
    )
  }

  get field(): { [key: string]: AbstractControl } { // we can get name field in the template using field.name instead of form.controls.name
    return this.profileForm.controls;
  }

  createProfile(): void{
    this.submitted = true;
    this.profileForm.invalid ? 
      this.showErrors() : this.saveProfile();
    
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
      languageId : this.field['language'].value,
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
