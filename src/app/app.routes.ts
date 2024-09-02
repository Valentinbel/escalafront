import { Routes } from '@angular/router';
import { ClimberprofileComponent } from './climberprofile/climberprofile.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {path: '', redirectTo: 'climber-profile', pathMatch:'full'},
    {path: 'climber-profile', component: ClimberprofileComponent},
    {path: 'searches', component: SearchComponent}, //have to be search by profile
    {path: 'contact', component: ContactComponent},
];