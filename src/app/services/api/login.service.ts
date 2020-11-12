import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { map } from 'rxjs/operators';
import { UserAdapter } from 'src/app/adapters/user.adapter';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private userAdapter: UserAdapter) {}

    public login(email, password): Observable<User> {
        return this.http.put(environment.endpoints.login, {
            email,
            password
        }).pipe(
            map((data: any) => this.userAdapter.adapt({...data, email}))
        );
    }
}
