import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated'],
    { ['authenticationStatus']: of(true) });

  @Component({selector: 'app-header', template: ''})
  class HeaderMockComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AppComponent, HeaderMockComponent ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authenticationServiceMock.isAuthenticated.calls.reset();
  });

  it('should render app and header components when it is loaded and the user is authenticated', () => {
    // Arrange
    authenticationServiceMock.isAuthenticated.and.returnValue(true);

    // Act
    component.ngOnInit();
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.directive(HeaderMockComponent));

    // Assert
    expect(component).toBeTruthy();
    expect(header).toBeTruthy();
  });

  it('should not render the header component when the user is not authenticated', () => {
    // Arrange
    authenticationServiceMock.isAuthenticated.and.returnValue(false);

    // Act
    component.ngOnInit();
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.directive(HeaderMockComponent));

    // Assert
    expect(header).toBeFalsy();
  });
});
