import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetsListAdapter } from 'src/app/adapters/assets-list.adapter';
import { AssetsList } from 'src/app/models/asset';
import { environment } from 'src/environments/environment';

@Injectable()
export class CompanyService {
    constructor(private http: HttpClient, private assetsListAdapter: AssetsListAdapter) {}

    getAssetsListByCompany(companyId): Observable<AssetsList> {
        return this.http.get(`${environment.endpoints.companies}/${companyId}/assets`).pipe(
            map((data: any[]) => this.assetsListAdapter.adapt(data))
        );
    }

    getAssetsListByRef(href): Observable<AssetsList> {
        return this.http.get(`${environment.endpoints.server}/${href}`).pipe(
            map((data: any[]) => this.assetsListAdapter.adapt(data))
        );
    }
}
