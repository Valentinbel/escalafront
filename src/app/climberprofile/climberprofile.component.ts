import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../auth/auth-storage.service';

@Component({
  selector: 'app-climberprofile',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './climberprofile.component.html',
  styleUrl: './climberprofile.component.css',
})
export class ClimberprofileComponent {
  climberProfile: ClimberProfile;
  private userId: number;
  private profileId: number;

  constructor(
    private readonly climberprofileService: ClimberprofileService,
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // TODO: clean this user / userID si pas nécessaire ??
    this.userId = this.authStorageService.getClimberUser().id;
    this.profileId = this.authStorageService.getProfileId();
    console.log(this.userId);
    console.log(this.profileId);
    if (this.userId && this.profileId === 0) {
      console.log('on va chercher le profile');
      this.getProfileByUserId(this.userId);
    }
  }

  getProfileByUserId(userId: number): void {
    this.climberprofileService.getProfileByUserId(userId).subscribe({
      next: (climberProfile) => {
        this.climberProfile = climberProfile;
        this.authStorageService.setProfileId(climberProfile.id!);
        console.log(this.climberProfile);
      },
      error: (err) => console.log('There is no profile related to your account. Please create one.',err)
    });
  }

  openAddProfile() {
    const userId = this.userId;
    this.router.navigate(['/add-climber-profile'], { state: { userId } });
  }
}
