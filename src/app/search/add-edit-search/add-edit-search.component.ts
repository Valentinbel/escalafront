import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
  FormBuilder, AbstractControl, FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../shared/snack-bar/snack-bar.service";
import {Search} from "../../model/search.model";
import {Profile} from "../../model/profile.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {MatFormField, MatInputModule, MatLabel} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {DateAdapter} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SearchService} from "../search.service";
import {Subject} from "rxjs";
import {LanguagesStorageService} from "../../navbar/languages/languages-storage.service";
import {MatchService} from "../match/match.service";

@Component({
  selector: 'app-add-edit-search',
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
export class AddEditSearchComponent implements OnInit, OnDestroy {

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  snackBarService = inject(SnackBarService);
  translateService = inject(TranslateService);
  dateAdapter = inject(DateAdapter);
  languageStorageService = inject(LanguagesStorageService);
  matchService = inject(MatchService);

  searchForm: FormGroup = new FormGroup({
    datePicker: new FormControl(''),
    timePicker: new FormControl(''),
    climbLevelMin: new FormControl(''),
    climbLevelMax: new FormControl(''),
    placeId: new FormControl(''),
    searchTitle: new FormControl(''),
  });

  search: Search;
  searchId: number;
  profile: Profile;
  profileId: number;
  isAddMode: boolean;
  submitted = false;

  constructor() {}

  readonly languageSignal = this.languageStorageService.language;
  private readonly dateLocale = effect(() => this.dateAdapter.setLocale(this.languageSignal()));
  private readonly destroy$ = new Subject<void>();

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
      datePicker: [null, Validators.required],
      timePicker: [null, Validators.required],
      //timeSlots: ['', Validators.required ],// Date future ?
      climbLevelMin: [],
      climbLevelMax: [],
      placeId: [],
      searchTitle: [],
    });
  }

  get field(): { [key: string]: AbstractControl } { // using field.name instead of form.controls.name
    return this.searchForm.controls;
  }

  submitSearch(): void {
    this.submitted = true;

    this.searchForm.invalid ? this.showErrors() : this.saveSearch();
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
    const formValue = this.searchForm.value;
    const convertedTimeSlot:Date = this.convertTodateTime(formValue.datePicker, formValue.timePicker);
    console.log("convertedTimeSlot: ", convertedTimeSlot);
    let dates: Date[] = [];
    dates.push(convertedTimeSlot);

    this.search = {
      id: this.searchId,
      timeSlots: dates,
      climbLevels: [{id:6,codeFr:'6A'}, {id:10,codeFr:'6C'}],//this.field['climbLevels'].value,////////
      placeId: this.field['placeId'].value,
      title: this.field['searchTitle'].value,
      profileId: this.profileId,
    };
    console.log("search to Save: ", JSON.stringify(this.search)) // /!\ JSON.stringify() will put Date in UTC (should be a wrong value)

    this.searchService.createSearch(this.search).subscribe({
      next: (newsearch) => {
        console.log("retour du back saveSearch: " + JSON.stringify(newsearch)); // /!\ JSON.stringify() will put Date in UTC (should be a wrong value)
        this.createMatchIfExist(newsearch.id);// TODO Passer en chained
        this.router.navigate(['../searches'], {relativeTo: this.route});
      },
      error: (err) => {
        console.log("Error trying to save Search: ", err)
        this.snackBarService.add(err.error.message, 8000, 'error');
      }
      });
  }

  private convertTodateTime(date: Date, time: Date) : Date { // retourne un timeSlotDTO
    let myTime = new Date(time);
    const combinedDate = new Date(date);
    combinedDate.setHours(myTime.getHours());
    combinedDate.setMinutes(myTime.getMinutes());
    console.log("combinedDate ", combinedDate);

    return combinedDate;
  }

  createMatchIfExist(searchId: number) {
    this.matchService.createMatchBySearchId(searchId).subscribe({
      next: (match) => {
        console.log(match);
      }
    });
  }

  cancelSearch(): void {
    this.router.navigate(['../search'], { relativeTo: this.route });
    alert("T'as cliqué sur cancel, tu vas être redirigé");
  }

  ngOnDestroy(): void {
    // clean subscription
    this.destroy$.next();
    this.destroy$.complete();
  }

}
