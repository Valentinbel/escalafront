import { Component, OnInit } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../auth/auth-storage.service';
import { ProfileStorageService } from './profile-storage.service';

@Component({
    selector: 'app-climberprofile',
    imports: [RouterModule, CommonModule, TranslateModule],
    templateUrl: './climberprofile.component.html',
    styleUrl: './climberprofile.component.css'
})
export class ClimberprofileComponent implements OnInit{
  climberProfile: ClimberProfile;
  userName: string;
  private userId: number;

  constructor(
    private readonly climberprofileService: ClimberprofileService,
    private readonly authStorageService: AuthStorageService,
    private readonly profileStorageService: ProfileStorageService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authStorageService.getClimberUser().id;
    this.userName = this.authStorageService.getUserName();
    if (this.userId) { //TODO : and ... ? && this.profileId === 0 pour éviter l'erreur  error: (err) => console.log('There is no profile related to your account.
      this.getProfileByUserId(this.userId);
    }
  }

  getProfileByUserId(userId: number): void {
    this.climberprofileService.getProfileByUserId(userId).subscribe({
      next: (climberProfile: ClimberProfile) => {
        this.climberProfile = climberProfile;
        this.profileStorageService.setProfile(climberProfile);
      },
      error: (err) => console.log('There is no profile related to your account. Please create one.',err)
    });
  }

  openAddProfile() {
    const userId = this.userId;
    const profile = this.climberProfile;
      //TODO Vérifier ce qu'on envoie ici. Avatar Service #1 dit :
      // const profile = this.climberProfile ?? null;
    console.log("profile envoyé à Create: " + JSON.stringify(profile));
    const userName = this.userName;
    this.router.navigate(['/add-climber-profile'], { state: { userId, userName, profile } });
  }
}
