import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  AbstractControl,
  FormsModule
} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../shared/snack-bar/snack-bar.service";
import {Search} from "../../model/search.model";
import {Profile} from "../../model/profile.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {MatFormField, MatInputModule, MatLabel} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-add-edit-search',
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}],
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatTimepickerInput,
    MatFormField,
    MatLabel,
    FormsModule,
    MatTimepicker,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerToggle,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker
],
  templateUrl: './add-edit-search.component.html',
  styleUrl: './add-edit-search.component.css',
})
export class AddEditSearchComponent implements OnInit {

  searchForm: FormGroup = new FormGroup({ // TODO....................

    datePicker: new FormControl(''),
    timePicker: new FormControl(''),
    timeSlots: new FormControl(''),
    climbLevelMin: new FormControl(''),
    climbLevelMax: new FormControl(''),
    placeId: new FormControl(''),
    comment: new FormControl(''),
  });

  search: Search;
  searchId: number;
  profile: Profile;
  profileId: number;
  isAddMode: boolean;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {

    console.log("editSearch state.profileId: ", JSON.stringify(history.state.profileId, null, 2));
    if (history.state.profileId)
      this.profileId = history.state.profileId;

    if (history.state.search) {
      //this.search = history.state.search;
      //this.searchId = history.state.search.id;
      this.isAddMode = true;

    } else this.isAddMode = false;

    this.searchForm = this.formBuilder.group({ //TODO
      datePicker: [],
      timePicker: [],
      //timeSlots: ['', Validators.required ],// Date future ?
      climbLevelMin: [],
      climbLevelMax: [],
      placeId: [],
      comment: [],
    });
  }

  get field(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name
    return this.searchForm.controls;
  }

  submitSearch(): void {
    this.submitted = true;

    this.searchForm.invalid ? this.showErrors() : this.saveSearch();
    // console.log('Search: ' + JSON.stringify(this.searchForm.value, null, 2));
  }

  private showErrors(): void {
    for (const value in this.field) {
      if (this.field[value].errors) {
        let fieldError = this.translateService.instant('form.fieldError');
        this.snackBarService.add(fieldError + value, 8000, 'error');
      }
    }
  }

  private saveSearch(): void {
    //console.log("DATE: ", new Date());
    console.log("DATE PICKER: "+ this.field['datePicker'].value);
    console.log("TIME PICKER: "+ this.field['timePicker'].value);
    console.log("placeId: "+ this.field['placeId'].value);
    console.log("comment: "+ this.field['comment'].value);
    // TODO monter le ClimbLevel[]
    /*this.search = {
      id: this.searchId,
      timeSlots: new Date(),//this.field['timeSlots'].value,
      climbLevels: this.field['climbLevels'].value,////////
      placeId: this.field['placeId'].value,
      comment: this.field['comment'].value,
      profileId: this.profileId,
    };*/

    //console.log("search to Save: ", JSON.stringify(this.search))
  }


  cancelSearch(): void {
    this.router.navigate(['../search'], { relativeTo: this.route });
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }

}
