import { Injectable } from '@angular/core';
import { LoginService } from './api/login.service';
import { SessionStorageService } from './session-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CompanyHelperService } from './company-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private loginService: LoginService,
        private sessionStorageService: SessionStorageService,
        private router: Router,
        private companyHelperService: CompanyHelperService) {
    }

    get authenticationStatus(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    async login(email, password): Promise<void> {
        try {
            const user = await this.loginService.login(email, password).toPromise();
            this.sessionStorageService.add('token', user.token);
            this.companyHelperService.setCompanies(user.companies);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['assets']);
        } catch (err) {
            this.clearAuthenticationData();
            throw err;
        }
    }

    getToken(): string {
        return this.sessionStorageService.get('token');
    }

    logout(): void {
        this.clearAuthenticationData();
        this.router.navigate(['login']);
    }

    private clearAuthenticationData(): void {
        this.sessionStorageService.clear();
        this.isAuthenticatedSubject.next(false);
        this.companyHelperService.setCompanies([]);
    }
}
