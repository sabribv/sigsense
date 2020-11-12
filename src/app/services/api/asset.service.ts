import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AssetAdapter } from 'src/app/adapters/asset.adapter';
import { Asset } from 'src/app/models/asset';

@Injectable()
export class AssetService {
    constructor(private http: HttpClient, private assetAdapter: AssetAdapter, private domSanitizer: DomSanitizer) {}

    getAsset(asset): Observable<Asset> {
        return this.http.get(`${environment.endpoints.server}${asset}`).pipe(
            map((data: any) => {
                data = {
                    ...data,
                    image: this.getAssetImage(data.href)
                };
                return this.assetAdapter.adapt(data);
            })
        );
    }

    getAssetImage(asset): Observable<any> {
        return this.http.get(`${environment.endpoints.server}${asset}/image`,
        {
            responseType: 'blob'
        }).pipe(
            map(blob => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)))
        );
    }
}
