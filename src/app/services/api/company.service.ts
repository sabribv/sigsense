import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class CompanyService {
    constructor(private http: HttpClient) {}

    getAssetsListByCompany(companyId): Observable<any> {
        return this.http.get(`${environment.endpoints.companies}/${companyId}/assets`);
    }

    getAssetsListByRef(href): Observable<any> {
        return this.http.get(`${environment.endpoints.server}/${href}`);
    }
}
