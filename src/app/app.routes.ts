import { Routes } from '@angular/router';
import { ClimberprofileComponent } from './climberprofile/climberprofile.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateClimberprofileComponent } from './climberprofile/create-climberprofile/create-climberprofile.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/connect/register/register.component';
import { LoginComponent } from './auth/connect/login/login.component';
import { ConnectComponent } from './auth/connect/connect.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch:'full'
    },
    {
        path: 'home',
        title: 'Home', 
        component: HomeComponent
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
        path: 'connect', 
        title: 'Connect',
        component: ConnectComponent
    },   
    {
        path: 'register', 
        title: 'Register',
        component: RegisterComponent
    },    
    {
        path: 'login', 
        title: 'Login',
        component: LoginComponent
    },
    { 
        path: '**', 
        title: '404', 
        component: PageNotFoundComponent 
    }
];