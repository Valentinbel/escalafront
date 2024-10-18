import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthStorageService } from "../../auth/auth-storage.service";
import { EventBusService } from "../event-bus.service";
import { EventData } from "../event.class";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    private isRefreshing: boolean = false;

    constructor(private readonly authStorageService: AuthStorageService, private readonly eventBusService: EventBusService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials:true,
        });
        console.log("ON est bien dans HttpRequestInterceptor");

        return next.handle(req).pipe(
            catchError((error) => {
                if(error instanceof HttpErrorResponse 
                    && !req.url.includes('auth/login') 
                    && error.status === 401) {
                        return this.handle401Error(req, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        console.log("handle401Error function");
        if(!this.isRefreshing) {
            this.isRefreshing = true;
            console.log("!this.isRefreshing");
            if(this.authStorageService.isLoggedIn()) {
                console.log("on va appeler this.eventBusService.emit");
                this.eventBusService.emit(new EventData('logout', null));
            }
        }
        return next.handle(request);
    }

}

export const HttpRequestInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi:true}
];