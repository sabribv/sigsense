import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AssetsAdapter } from 'src/app/adapters/assets.adapter';
import { AssetsList } from 'src/app/models/asset';
import { CompanyBuilderService } from 'src/app/services/company-builder.service';

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

  constructor(private companyBuilderService: CompanyBuilderService, private assetsAdapter: AssetsAdapter) { }

  ngOnInit(): void {
    this.subscription = this.companyBuilderService.selectedCompany.subscribe(company => {
      this.companyId = company.id;
      this.getAssets();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async getAssets(href = null) {
    try {
      this.currentStatus = dataStatus.loading;
      this.assetsList = await this.assetsAdapter.getCompanyAssets(this.companyId, href);
      this.currentStatus = this.assetsList.assets.length ? dataStatus.ready : dataStatus.empty;
    } catch {
      this.currentStatus = dataStatus.error;
    }
  }

  onGetPage(href: string): void {
    this.getAssets(href);
  }
}
