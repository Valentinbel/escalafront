import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {ProfileStorageService} from "../profile/profile-storage.service";
import {AuthStorageService} from "../auth/auth-storage.service";

@Component({
	selector: 'app-search',
	imports: [RouterModule, TranslateModule],
	templateUrl: './search.component.html',
	styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  profileId: number|undefined;

	constructor(private readonly router: Router,
              private readonly authStorageService: AuthStorageService,
              private readonly profileStorageService: ProfileStorageService) { }

	ngOnInit(): void {


    this.profileId = this.profileStorageService.getProfile().id;
    console.log("profileId: " + this.profileId);


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

}
