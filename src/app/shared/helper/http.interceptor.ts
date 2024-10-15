import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials:true,
        });
        console.log("ON est bien dans HttpRequestInterceptor")
        return next.handle(req);
    }
}

export const HttpRequestInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi:true}
];