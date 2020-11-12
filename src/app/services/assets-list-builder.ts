import { Injectable } from '@angular/core';
import { Asset, AssetsList } from '../models/asset';
import { AssetService } from './api/asset.service';
import { CompanyService } from './api/company.service';

@Injectable()
export class AssetsListBuilder {
    constructor(
        private companyService: CompanyService,
        private assetService: AssetService
    ) {}

    getAssetsList(companyId, href = null): Promise<AssetsList> {
        return new Promise(async (resolve, reject) => {
            try {
                const assetsList = href ?
                    await this.companyService.getAssetsListByRef(href).toPromise() :
                    await this.companyService.getAssetsListByCompany(companyId).toPromise();

                const assetsPromises = [];
                assetsList.assets.forEach(element => {
                    assetsPromises.push(
                        this.assetService.getAsset(element.href).toPromise()
                    );
                });
                const response = await Promise.all<Asset>(assetsPromises);
                assetsList.assets = assetsList.assets.map(asset => response.find(item => item.href === asset.href));
                resolve(assetsList);
            } catch (err) {
                reject();
            }
        });
    }
}
