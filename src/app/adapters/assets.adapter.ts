import { Injectable } from '@angular/core';
import { Asset, AssetsList } from '../models/asset';
import { AssetService } from '../services/api/asset.service';
import { CompanyService } from '../services/api/company.service';

@Injectable()
export class AssetsAdapter {
    constructor(
        private companyService: CompanyService,
        private assetServicee: AssetService
    ) {}

    getCompanyAssets(companyId, href = null): Promise<AssetsList> {
        return new Promise(async (resolve, reject) => {
            try {
                const assetsListResult = href ?
                    await this.companyService.getAssetsListByRef(href).toPromise() :
                    await this.companyService.getAssetsListByCompany(companyId).toPromise();

                const assetsPromises = [];
                assetsListResult.items.forEach(element => {
                    assetsPromises.push(
                        this.assetServicee.getAsset(element).toPromise()
                    );
                });
                const response = await Promise.all(assetsPromises);
                const assets = response.map(asset => {
                    return {
                            name: asset.name,
                            description: asset.description,
                            manufacturer: asset.manufacturer,
                            image: this.assetServicee.getAssetImage(asset.href)
                    } as Asset;
                }) as Asset[];
                const list = {
                    assets,
                    totalItems: assetsListResult.size,
                    start: assetsListResult.start,
                    limit: assetsListResult.limit,
                    previous: assetsListResult.links.previous,
                    next: assetsListResult.links.next
                } as AssetsList;
                resolve(list);
            } catch (err) {
                reject();
            }
        });
    }
}
