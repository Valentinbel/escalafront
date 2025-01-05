import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthStorageService } from "../../auth/auth-storage.service";
import { EventBusService } from "../event-bus.service";
import { EventData } from "../event.class";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { MessageResponse } from "../../model/messageresponse.model";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    private isRefreshing: boolean = false;

    constructor(
        private readonly authStorageService: AuthStorageService, 
        private readonly authService: AuthService,
        private readonly eventBusService: EventBusService,
        private readonly router: Router){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       req = this.buildRequest(req);
         
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

      private buildRequest(req: HttpRequest<any>): HttpRequest<any> {
        let user = this.authStorageService.getClimberUser();
        let token = user.accessToken;
        
        if(token){
          return req.clone({ 
            withCredentials: true, 
            setHeaders: { 'Authorization': 'Bearer ' + token 
          }});
        } else {
          return req.clone({ 
            withCredentials: true, 
          });
        }
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
    
                if (error.status === 403) {
                  this.eventBusService.emit(new EventData('logout', null));
                  console.log("403 Forbidden, You are authenticated but can't access this one");                
                }
                if (error.status === 401) {
                  const userId = this.authStorageService.getClimberUserId();
                  this.authStorageService.clean();
                  this.eventBusService.emit(new EventData('logout', null));
                  this.authService.logout(userId).subscribe({
                    next: (reponses: MessageResponse) => {
                      console.log(reponses.message);
                    },
                    error: (err) => {
                      console.log(err);
                    }
                  });
                  this.router.navigateByUrl('/connect');
                }
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