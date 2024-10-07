import { Component } from '@angular/core';
import { ClimberprofileService } from './../climberprofile/climberprofile.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClimberProfile } from '../model/climberprofile.model';
import { Observable} from 'rxjs';
import { state } from '@angular/animations';
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
    private climberprofileService: ClimberprofileService, 
    private router: Router,
    private route: ActivatedRoute){}

  ngOnInit(){
    console.log("Salut ClimberprofileComponent");
    //  récupérer le ClimberProfile grâce au User en amont. 
  
    this.getClimberProfileById(1);
  }

  getClimberProfileById(id: number): void {
    this.climberprofileService.getClimberProfileById(id).subscribe((climberProfile) =>{
      this.climberProfile =  climberProfile;
      console.log(this.climberProfile);
    } );
  }

  openRubrique() {
    // this.matomoService.updateUrl('/rubrique');
    //this.router.navigate(['/add-climber-profile'], { state: { contenu } });

    this.router.navigate(
      ['/add-climber-profile']
      //{queryParams:{order:'popular','price-range':'expensive'}}
      //state: { hello: 'world'}
      );
}
}

