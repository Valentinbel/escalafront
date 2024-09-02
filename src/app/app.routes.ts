import { Routes } from '@angular/router';
import { ClimberprofileComponent } from './climberprofile/climberprofile.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateClimberprofileComponent } from './climberprofile/create-climberprofile/create-climberprofile.component';


export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'climber-profile', 
        pathMatch:'full'
    },
    {
        path: 'climber-profile',
        title: 'Profile', 
        component: ClimberprofileComponent
    },
    {
        path: 'add-climber-profile',
        title: 'Add profile', 
        component: CreateClimberprofileComponent
    },
    {
        path: 'searches', 
        title: 'Searches', 
        component: SearchComponent 
    }, 
    // create search by profile
    {
        path: 'contact', 
        title: 'Contact',
        component: ContactComponent
    },
    { 
        path: '**', 
        title: '404', 
        component: PageNotFoundComponent 
    }
];