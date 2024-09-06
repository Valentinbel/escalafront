import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClimberprofileService } from './climberprofile/climberprofile.service';
import { NavbarComponent } from "./navbar/navbar.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterModule ], //RouterOutlet
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'escalafront';

  constructor(private climberprofileService: ClimberprofileService){}

  ngOnInit(){
    /*console.log("Salut les amis");
    this.climberprofileService.getAllClimberProfiles().subscribe((climberProfile) => console.log("getAllClimberProfiles: " , climberProfile));

    this.climberprofileService.getClimberProfileById(1).subscribe((climberProfile) => console.log("getClimberProfileById(1): ", climberProfile));*/
      }
}
