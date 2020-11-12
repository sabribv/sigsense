import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyHelperService } from 'src/app/services/company-helper.service';
import { HeaderComponent } from './header.component';

const companies = [
  { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
  { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] }
];

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', ['logout']);
  const companyHelperServiceMock = jasmine.createSpyObj('CompanyHelperService', ['setSelectedCompany'],
    { ['availableCompanies']: of(companies), ['selectedCompany']: of(companies[0]) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ BrowserAnimationsModule, MatMenuModule, MatButtonModule, MatToolbarModule, MatIconModule ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: CompanyHelperService, useValue: companyHelperServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authenticationServiceMock.logout.calls.reset();
    companyHelperServiceMock.setSelectedCompany.calls.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should render the header component when it is loaded', () => {
    // Arrange
    const toolbar = fixture.debugElement.query(By.directive(MatToolbar));
    const menus = fixture.debugElement.queryAll(By.directive(MatMenu));
    const menuButtons = fixture.debugElement.queryAll(By.css('mat-toolbar > button'));

    // Assert
    expect(component).toBeTruthy();
    expect(toolbar).toBeTruthy();
    expect(menus.length).toBe(3);
    expect(menuButtons.length).toBe(3);
    expect(component.companies).toEqual(companies);
    expect(component.selectedCompany).toEqual(companies[0]);
  });

  it('should change the selected company when the user select another company from the menu', () => {
    // Arrange
    const menuButtons = fixture.debugElement.queryAll(By.css('mat-toolbar > button'));

    // Act
    menuButtons[1].nativeElement.click();
    fixture.detectChanges();
    const companiesButtons = fixture.debugElement.queryAll(By.css('.mat-menu-content > button'));
    companiesButtons[1].nativeElement.click();

    // Assert
    expect(companyHelperServiceMock.setSelectedCompany).toHaveBeenCalledTimes(1);
    expect(companyHelperServiceMock.setSelectedCompany).toHaveBeenCalledWith(companies[1]);
  });

  it('should logout when the user clicks on the logout button', () => {
    // Arrange
    const menuButtons = fixture.debugElement.queryAll(By.css('mat-toolbar > button'));

    // Act
    menuButtons[2].nativeElement.click();
    fixture.detectChanges();
    const userOptionsButtons = fixture.debugElement.queryAll(By.css('.mat-menu-content > button'));
    userOptionsButtons[0].nativeElement.click();

    // Assert
    expect(authenticationServiceMock.logout).toHaveBeenCalledTimes(1);
  });
});
