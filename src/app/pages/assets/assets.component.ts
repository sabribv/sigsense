import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AssetsList } from 'src/app/models/asset';
import { AssetsListBuilder } from 'src/app/services/assets-list-builder';
import { CompanyHelperService } from 'src/app/services/company-helper.service';

enum dataStatus {
  loading,
  ready,
  empty,
  error
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnDestroy {
  tableColumns: string[] = ['image', 'name', 'description', 'manufacturer'];
  assetsList: AssetsList = undefined;
  currentStatus = dataStatus.loading;
  status = dataStatus;

  private companyId;
  private subscription: Subscription;

  constructor(private companyHelperService: CompanyHelperService, private assetsListBuilder: AssetsListBuilder) { }

  ngOnInit(): void {
    this.subscription = this.companyHelperService.selectedCompany.subscribe(company => {
      this.companyId = company.id;
      this.getAssets();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async getAssets(href = null): Promise<void> {
    try {
      this.currentStatus = dataStatus.loading;
      this.assetsList = await this.assetsListBuilder.getAssetsList(this.companyId, href);
      this.currentStatus = this.assetsList.assets.length ? dataStatus.ready : dataStatus.empty;
    } catch {
      this.currentStatus = dataStatus.error;
    }
  }

  onGetPage(href: string): void {
    this.getAssets(href);
  }
}
