import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-climberprofile',
  standalone: true,
  imports: [ RouterModule, CommonModule, TranslateModule],
  templateUrl: './climberprofile.component.html',
  styleUrl: './climberprofile.component.css'
})
export class ClimberprofileComponent {

  climberProfile: ClimberProfile;
  
  constructor(
    private readonly climberprofileService: ClimberprofileService, 
    private readonly router: Router,
    private readonly route: ActivatedRoute){}

  ngOnInit(){
    //  récupérer le ClimberProfile grâce au User en amont. 
  
    this.getClimberProfileById(1);
  }

  getClimberProfileById(id: number): void {
    this.climberprofileService.getClimberProfileById(id).subscribe((climberProfile) =>{
      this.climberProfile =  climberProfile;
      console.log(this.climberProfile);
    } );
  }

  openAddProfile() {
    this.router.navigate(['/add-climber-profile']);
}
}

