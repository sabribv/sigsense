import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class AssetService {
    constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}

    getAsset(asset): Observable<any> {
        return this.http.get(`${environment.endpoints.server}${asset}`);
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
