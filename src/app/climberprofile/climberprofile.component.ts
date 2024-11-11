import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../auth/auth-storage.service';

@Component({
  selector: 'app-climberprofile',
  standalone: true,
  imports: [ RouterModule, CommonModule, TranslateModule],
  templateUrl: './climberprofile.component.html',
  styleUrl: './climberprofile.component.css'
})
export class ClimberprofileComponent {

  climberProfile: ClimberProfile;
  private userId: number;
  private user:any;
  
  constructor(
    private readonly climberprofileService: ClimberprofileService, 
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute){}

  ngOnInit(){
    // TODO récupérer le ClimberProfile grâce au User en amont. 
    this.userId = this.authStorageService.getClimberUser().id;
    this.user = this.authStorageService.getClimberUser();
    console.log(this.userId);
    this.getClimberProfileById(1);
  }

  getClimberProfileById(id: number): void {
    this.climberprofileService.getClimberProfileById(id).subscribe((climberProfile) =>{
      this.climberProfile =  climberProfile;
      console.log(this.climberProfile);
    } );
  }

  openAddProfile() {
    let userId = this.userId
    let user = this.user
    this.router.navigate(['/add-climber-profile'], {state: {userId, user} });
}
}

