import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../auth/auth-storage.service';
import { ProfileStorageServiceService } from './profile-storage-service.service';

@Component({
    selector: 'app-climberprofile',
    imports: [RouterModule, CommonModule, TranslateModule],
    templateUrl: './climberprofile.component.html',
    styleUrl: './climberprofile.component.css'
})
export class ClimberprofileComponent {
  climberProfile: ClimberProfile;
  userName: string;
  private userId: number;

  constructor(
    private readonly climberprofileService: ClimberprofileService,
    private readonly authStorageService: AuthStorageService,
    private readonly profileStorageService: ProfileStorageServiceService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authStorageService.getClimberUser().id;
    this.userName = this.authStorageService.getUserName();
    if (this.userId) { //TODO : and ... ? && this.profileId === 0
      this.getProfileByUserId(this.userId);
    }
  }

  getProfileByUserId(userId: number): void {
    this.climberprofileService.getProfileByUserId(userId).subscribe({
      next: (climberProfile: ClimberProfile) => {
        this.climberProfile = climberProfile;
        this.profileStorageService.setProfile(climberProfile);
        console.log(this.climberProfile);
      },
      error: (err) => console.log('There is no profile related to your account. Please create one.',err)
    });
  }

  openAddProfile() {
    const userId = this.userId;
    const profile = this.climberProfile;
    const userName = this.userName;
    this.router.navigate(['/add-climber-profile'], { state: { userId, userName, profile } });
  }
}
