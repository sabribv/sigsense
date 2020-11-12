import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyHelperService } from 'src/app/services/company-helper.service';

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
  private companyHelperService: CompanyHelperService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.companyHelperService.availableCompanies.subscribe(companies => {
      this.companies = companies;
    }));

    this.subscriptions.push(this.companyHelperService.selectedCompany.subscribe(company => {
      this.selectedCompany = company;
    }));
  }

  onCompanyChange(company): void {
    this.companyHelperService.setSelectedCompany(company);
  }

  onLogout(): void {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
