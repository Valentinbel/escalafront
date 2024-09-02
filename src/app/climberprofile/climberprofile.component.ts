import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-climberprofile',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './climberprofile.component.html',
  styleUrl: './climberprofile.component.css'
})
export class ClimberprofileComponent {
  constructor(private climberprofileService: ClimberprofileService){}

  ngOnInit(){
    console.log("Salut les amis");
    this.climberprofileService.getAllClimberProfiles().subscribe((climberProfile) => console.log("getAllClimberProfiles: " , climberProfile));

    this.climberprofileService.getClimberProfileById(1).subscribe((climberProfile) => console.log("getClimberProfileById(1): ", climberProfile));
      }
}

