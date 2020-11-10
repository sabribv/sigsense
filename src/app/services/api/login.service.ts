import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) {}

    public login(email, password): Observable<any> {
        return this.http.put(environment.endpoints.login.login, {
            email,
            password
        });
    }
}
