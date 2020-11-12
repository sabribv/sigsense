import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Company } from '../models/company';
import { SessionStorageService } from './session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyHelperService {
    private companiesSubject = new BehaviorSubject<Company[]>([]);
    private selectedCompanySubject = new BehaviorSubject<Company>(undefined);

    constructor(private sessionStorageService: SessionStorageService) {
        const metadata = this.sessionStorageService.get('metadata');
        if (metadata) {
            const companies = JSON.parse(atob(metadata));
            this.setAvailableCompanies(companies);
        }
    }

    get availableCompanies(): Observable<Company[]> {
        return this.companiesSubject.asObservable();
    }

    get selectedCompany(): Observable<Company> {
        return this.selectedCompanySubject.asObservable();
    }

    setCompanies(companies: Company[]): void {
        this.setAvailableCompanies(companies);
    }

    setSelectedCompany(company: Company): void {
        this.selectedCompanySubject.next(company);
    }

    private setAvailableCompanies(companies: Company[]): void {
        this.sessionStorageService.add('metadata', btoa(JSON.stringify(companies)));
        this.companiesSubject.next(companies);

        if (companies.length) {
            this.selectedCompanySubject.next(companies[0]);
        }
    }
}
