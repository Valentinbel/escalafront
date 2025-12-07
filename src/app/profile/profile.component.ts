import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { RouterModule, Router } from '@angular/router';
import { Profile } from '../model/profile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../auth/auth-storage.service';
import { ProfileStorageService } from './profile-storage.service';

@Component({
    selector: 'app-profile',
    imports: [RouterModule, CommonModule, TranslateModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profile: Profile;
  userName: string;
  private userId: number;

  constructor(
    private readonly profileService: ProfileService,
    private readonly authStorageService: AuthStorageService,
    private readonly profileStorageService: ProfileStorageService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authStorageService.getUser().id;
    this.userName = this.authStorageService.getUserName();
    if (this.userId) {
      this.getProfileByUserId(this.userId);
    }
  }

  getProfileByUserId(userId: number): void {
    this.profileService.getProfileByUserId(userId).subscribe({
      next: (profile: Profile) => {
        this.profile = profile;
        this.profileStorageService.setProfile(profile);
      },
      error: (err) => console.log('There is no profile related to your account. Please create one.',err)
    });
  }

  openAddProfile() {
    const userId = this.userId;
    const profile = this.profile;
    console.log("profile envoyé à Create: " + JSON.stringify(profile));
    const userName = this.userName;
    this.router.navigate(['/add-profile'], { state: { userId, userName, profile } });
  }
}
