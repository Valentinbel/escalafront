import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ClimberprofileService } from './../../climberprofile/climberprofile.service';
import { CommonModule } from '@angular/common';
import { ClimberProfile } from '../../model/climberprofile.model';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private climberprofileService: ClimberprofileService) {}

  ngOnInit(){
    this.profileForm = this.formBuilder.group(
      {
        name: ['', 
          [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)]
        ],
        description: ['', Validators.required],
        language:['', Validators.required],
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

    if (this.profileForm.invalid) {
      this.showErrors();
      return;
    } else {
      console.log("victory");

      // TODO: S'assurer que le profil sera rempli
      this.saveProfile();
      this.router.navigate(['../'], {relativeTo: this.route}); 
    }
    console.log(JSON.stringify(this.profileForm.value, null, 2));
  }

  private showErrors(): void {
    let errorFields: string[] = [];

    for(const value in this.field){
      if(this.field[value].errors){
        errorFields.push(value);
        errorFields.length >0 ? errorFields.push(" \n"): "";
        console.log("là c'est une erreur.  ", this.field[value].value);
        console.log("const value: ", value);
      }
      
    };
    // une alerte avec la liste des erreurs. 
    // Tester avec plusieurs champs en erreur, ==> Enleve les required inutiles quand c'est ok
    // ou plutot 
    console.log("Salut les champs en erreur sont: " + errorFields);
  }

  //TIG, on a des private dans les ts ?? 
  // A mon avis on peut trouver mieux qu'un void ici
  // REMPLIR LE climberProfile proprement pour l'envoyer dnas le service et creer un post propre
  private saveProfile(): void{

    this.climberProfile = {
      name : this.field['name'].value, 
      avatar: this.field['avatar'].value,
      genderId : this.field['genderId'].value, ///////////transformer en id
      languageId : this.field['languageId'].value, ///////////transformer en id
      notified : this.field['notified'].value,
      climberProfileDescription : this.field['description'].value,
    };

    console.log("Le climberProfile en question: " + this.climberProfile);

    // Appeler le post
    //this.climberprofileService.postClimberProfile()
  }

    cancel(): void {
      this.router.navigate(['../'], {relativeTo: this.route});
      //this.dialogRef.close(true);
      alert("T'as cliqué sur cancel, tu vas être redirigé");
    }
}
