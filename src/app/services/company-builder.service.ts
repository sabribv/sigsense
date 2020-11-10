import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Company } from '../models/company';
import { LocalStorageService, StorageType } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyBuilderService {
    private companiesSubject = new BehaviorSubject<Company[]>([]);
    private selectedCompanySubject = new BehaviorSubject<Company>(undefined);

    constructor(private localStorageSerive: LocalStorageService) {
        const metadata = this.localStorageSerive.get('metadata');
        if (metadata) {
            const companies = metadata ? JSON.parse(atob(metadata)) : [];
            if (!!companies) {
                this.setAvailableCompanies(companies);
            }
        }
    }

    get availableCompanies(): Observable<Company[]> {
        return this.companiesSubject.asObservable();
    }

    get selectedCompany(): Observable<Company> {
        return this.selectedCompanySubject.asObservable();
    }

    buildCompanies(roles): void {
        const companies = roles.map(role => {
            return {
                id: role.companyId,
                name: role.companyName,
                dashboards: role.Dashboards.map(dashboard => dashboard.replace(/^\w/, (character) => character.toUpperCase()))
            } as Company;
        }).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.setAvailableCompanies(companies);
    }

    setSelectedCompany(company: Company): void {
        this.selectedCompanySubject.next(company);
    }

    private setAvailableCompanies(companies: Company[]): void {
        this.localStorageSerive.add('metadata', btoa(JSON.stringify(companies)));
        this.companiesSubject.next(companies);

        if (companies.length) {
            this.selectedCompanySubject.next(companies[0]);
        }
    }
}
