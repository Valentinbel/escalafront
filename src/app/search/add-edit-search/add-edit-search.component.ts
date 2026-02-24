import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
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
import {DateAdapter} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {LocaleService} from "../../shared/locale.service";
import {SearchService} from "../search.service";
import {DateTime} from "luxon";
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";
import {Subject} from "rxjs";
import {LanguagesStorageService} from "../../navbar/languages/languages-storage.service";

@Component({
  selector: 'app-add-edit-search',
  providers: [provideLuxonDateAdapter(),],
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
  localeService = inject(LocaleService);
  dateAdapter = inject(DateAdapter);
  languageStorageService = inject(LanguagesStorageService);

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

  //TODO https://claude.ai/chat/ecf72cd5-a1ee-4c4d-81d0-9ad0324862a4


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
      comment: [],
    });
    console.log("ngOninit AddEditSearch dateAdapter set to: ", this.localeService.getCurrentLocale());
    // Applique la locale au démarrage du component
    // TODO Necessaire ?
    this.localeService.setLocale(this.localeService.getCurrentLocale());
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

    console.log("DATE PICKER: "+ this.field['datePicker'].value); //Thu Feb 19 2026 00:00:00 GMT+0100 (hora estándar de Europa central)
    console.log("TIME PICKER: "+ this.field['timePicker'].value); //Wed Feb 18 2026 08:30:00 GMT+0100 (hora estándar de Europa central)
    // console.log("placeId: "+ this.field['placeId'].value);
    // console.log("comment: "+ this.field['comment'].value);

    console.log("formatted dateTime: ", this.getFormattedDateTime());

    const formValue = this.searchForm.value;

    const timeSlot = this.convertTodateTime(formValue.datePicker, formValue.timePicker);
    console.log("timeSlot: ", timeSlot);

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

    // this.searchService.createSearch(this.search).subscribe({
    //   next: (search) => {
    //     console.log("retour du back saveSearch: " + JSON.stringify(search));
    //     // other logic.
    //   },
    //   error: (err) => {
    //     this.snackBarService.add(err.error.message, 8000, 'error');
    //   }
    //   });
  }

  private convertTodateTime(date: Date, time: Date) : any { // retourne un timeSlotDTO

    // TODO : Combiner le time sur l'objet.
    // TODO Verifier qu'avec getFormattedDateTime, on aura pas un decalage sur toISOString
    // TODO voir les fontions du localeService qui sont appelées

    const dateTime = DateTime.fromISO(date.toISOString());
    const timeDateTime = DateTime.fromISO(time.toISOString());



    ////

    const combinedDate = new Date(date);
    console.log("combinedDate sans time toLocaleString", combinedDate.toLocaleString());
    console.log("combinedDate toISOString", combinedDate.toISOString());

    //combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Format ISO 8601 pour le backend
    return {
      meetingDateTime: combinedDate.toISOString()
    };

  }

  // Afficher le format prévisualisé selon la locale //// a implémenter dnas le html pour voir apparaître la date selon la langue choisie
  getFormattedDateTime(): string {
    const date = this.searchForm.get('datePicker')?.value;
    const time = this.searchForm.get('timePicker')?.value;
    return this.localeService.formatDateTime(date, time);
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
