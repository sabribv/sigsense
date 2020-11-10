import { Injectable } from '@angular/core';
import { LoginService } from './api/login.service';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CompanyBuilderService } from './company-builder.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private loginService: LoginService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private companyBuilderService: CompanyBuilderService) {
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
            const result = await this.loginService.login(email, password).toPromise();
            this.localStorageService.add('token', result.token);
            this.companyBuilderService.buildCompanies(result.roles);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['assets']);
        } catch (err) {
            this.clearAuthenticationData();
            throw err;
        }
    }

    getToken(): string {
        return this.localStorageService.get('token');
    }

    logout(): void {
        this.clearAuthenticationData();
        this.router.navigate(['login']);
    }

    private clearAuthenticationData(): void {
        this.localStorageService.clear();
        this.isAuthenticatedSubject.next(false);
        this.companyBuilderService.buildCompanies([]);
    }
}
