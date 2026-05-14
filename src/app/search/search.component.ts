import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ProfileStorageService} from "../profile/profile-storage.service";
import {AuthStorageService} from "../auth/auth-storage.service";
import {Search} from "../model/search.model";
import {SearchService} from "./search.service";
import {SnackBarService} from "../shared/snack-bar/snack-bar.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
	selector: 'app-search',
	imports: [RouterModule, TranslateModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatInputModule, MatFormFieldModule, RouterLink],
	templateUrl: './search.component.html',
	styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  profileId: number|undefined;
  searches: Search[];

	constructor(private readonly router: Router,
              private readonly searchService: SearchService,
              private readonly translateService: TranslateService,
              private readonly snackBarService: SnackBarService,
              private readonly authStorageService: AuthStorageService,
              private readonly profileStorageService: ProfileStorageService) { }

	ngOnInit(): void {


    this.profileId = this.profileStorageService.getProfile().id;
    console.log("profileId: " + this.profileId);

    this.getAllSearches();
    //TODO  list https://claude.ai/chat/99c8dd43-58ca-4d62-9ff0-817b191fb4dc
	}

	openAddEditSearch(): void {
    // TODO quoi passer dans le state
    const profileId: number|undefined = this.profileId;
		this.router.navigate(['/add-edit-search'], { state: { profileId } });
	}

  createProfile(): void {
    const userId:number = this.authStorageService.getUserId();
    const userName: string = this.authStorageService.getUserName();
    this.router.navigate(['/add-edit-profile'], { state: { userId, userName, undefined } });
  }

  private getAllSearches(): void {
    this.searchService.getAllSearches().subscribe({
      next: (searches: any) => {
        console.log(JSON.stringify(searches));
        this.searches = searches;
        searches.forEach((search: any) => {console.log(search.profileId)})

      },
      error: (err) => {
        this.displayErrorSnackBar(err.error.message);
      },
    });
  }

  private displayErrorSnackBar(errorMessage: string): void {
    console.log(errorMessage);
    let messageLogin = this.translateService.instant('connect.login.error.loginFailed');
    let messageSave = this.translateService.instant('profile.edit.saveError');
    this.snackBarService.add(messageLogin, 8000, 'error');
    this.snackBarService.add(messageSave, 8000, 'error');
  }
}
