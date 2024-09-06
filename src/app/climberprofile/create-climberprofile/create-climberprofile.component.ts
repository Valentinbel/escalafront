import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-climberprofile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-climberprofile.component.html',
  styleUrl: './create-climberprofile.component.css'
})
export class CreateClimberprofileComponent {
  profileForm = new FormGroup({
    name: new FormControl(''),  
    description: new FormControl(''),
    language: new FormControl(''),
    gender: new FormControl(''),
    avatar: new FormControl(''),
    notified: new FormControl(''),
    
  });

constructor(private router: Router, private route: ActivatedRoute){}

ngOnInit(){

  //retrieve user

  // Bon formatage des champs
   // Description en text
  // Reactive form. https://angular.dev/guide/forms/reactive-forms/
  // Post

}

createProfile(){
    
}
  cancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
    //this.dialogRef.close(true);
  }
}
