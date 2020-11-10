import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    async canActivate() {
        const isAuthenticated = this.authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            await this.router.navigate(['login']);
        }
        return isAuthenticated;
    }
}
