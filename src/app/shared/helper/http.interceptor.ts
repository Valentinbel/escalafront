import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthStorageService } from "../../auth/auth-storage.service";
import { EventBusService } from "../event-bus.service";
import { EventData } from "../event.class";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    private isRefreshing: boolean = false;

    constructor(
        private readonly authStorageService: AuthStorageService, 
        private readonly authService: AuthService,
        private readonly eventBusService: EventBusService){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let user = this.authStorageService.getClimberUser();
        let token = user.accessToken;
        
      if(token){
        req = req.clone({ 
          withCredentials: true, 
          setHeaders: { 'Authorization': 'Bearer ' + token 
        }});
      } else {
        req = req.clone({ 
          withCredentials: true, 
         });
      }
         
        return next.handle(req).pipe(
          catchError((error) => {
            if (
              error instanceof HttpErrorResponse &&
              !req.url.includes('auth/login') &&
              error.status === 401
            ) {
              return this.handle401Error(req, next);
            } 
            return throwError(() => error);
          })
        );
      }
    
      private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          
          if (this.authStorageService.isLoggedIn()) {
            return this.authService.refreshToken().pipe(
              switchMap(() => {
                this.isRefreshing = false;
                return next.handle(request);
              }),
              catchError((error) => {
                console.log(error.status);
                this.isRefreshing = false;
    
                if (error.status == '403') {
                  this.eventBusService.emit(new EventData('logout', null));
                  console.log("403 Forbidden, You are authenticated but can't access this one");                
                }
               /* if (error.status == '401') {
                  this.authStorageService.clean();
                  window.location.reload();
                  this.eventBusService.emit(new EventData('logout', null));
                  this.authService.logout().subscribe({
                    next: res => {
                      console.log(res);
                    },
                    error: err => {
                      console.log(err);
                    }
                  });
                }*/
                return throwError(() => error);
              })
            );
          }
        }
        return next.handle(request);
      }
    }

export const httpInterceptorProviders  = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi:true}
];