import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig) //we just need to pass a standalone component that we want to turn into the root of the application.
// We can also import any dependencies that we need, like the router, forms, etc. using standalone APIs.
  .catch((err) => console.error(err));
