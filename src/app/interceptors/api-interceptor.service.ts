import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ApiInterceptorService {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let  authRequest = request.clone();

        if (request.url !== environment.endpoints.login.login) {
            const token = this.authenticationService.getToken();
            authRequest = request.clone({
                setHeaders: {
                    'x-access-token': token
                },
                body: request.body
            });
        }

        return next.handle(authRequest);
    }
}
