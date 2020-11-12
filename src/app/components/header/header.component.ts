import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyBuilderService } from 'src/app/services/company-builder.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
companies;
selectedCompany;
private subscriptions: Subscription[] = [];

constructor(
  private authenticationService: AuthenticationService,
  private companyBuilderService: CompanyBuilderService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.companyBuilderService.availableCompanies.subscribe(companies => {
      this.companies = companies;
    }));

    this.subscriptions.push(this.companyBuilderService.selectedCompany.subscribe(company => {
      this.selectedCompany = company;
    }));
  }

  onCompanyChange(company): void {
    this.companyBuilderService.setSelectedCompany(company);
  }

  onLogout(): void {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
