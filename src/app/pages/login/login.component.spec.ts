import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ BrowserAnimationsModule, MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule ],
      providers: [ FormBuilder,
        { provide: AuthenticationService, useValue: authenticationServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authenticationServiceMock.login.calls.reset();
  });

  it('should render the login component when it is loaded', () => {
    // Arrange
    const card = fixture.debugElement.query(By.directive(MatCard));
    const formFields = fixture.debugElement.queryAll(By.directive(MatFormField));
    const button = fixture.debugElement.query(By.css('button'));

    // Assert
    expect(component).toBeTruthy();
    expect(card).toBeTruthy();
    expect(formFields.length).toBe(2);
    expect(button.nativeElement.textContent).toEqual('Login');
  });

  it('should login when the user submits using valid credentials', async () => {
    // Arrange
    const username = 'fake@user.com';
    const password = 'fakepassword';
    component.form.setValue({ username, password });
    const button = fixture.debugElement.query(By.css('button'));
    authenticationServiceMock.login.and.returnValue(Promise.resolve());

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authenticationServiceMock.login).toHaveBeenCalledWith(username, password);
    expect(component.loginInvalid).toBeFalsy();
  });

  it('should not login when the user submits using invalid credentials', async () => {
    // Arrange
    const username = 'fake@user.com';
    const password = 'fakepassword';
    component.form.setValue({ username, password });
    const button = fixture.debugElement.query(By.css('button'));
    authenticationServiceMock.login.and.returnValue(Promise.reject());

    // Act
    button.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.directive(MatError));

    // Assert
    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authenticationServiceMock.login).toHaveBeenCalledWith(username, password);
    expect(component.loginInvalid).toBeTruthy();
    expect(error.nativeElement.textContent.trim()).toEqual('The username and password were not recognised');
  });

  it('should not login when the user submits using an invalid email address', async () => {
    // Arrange
    const username = 'fake user';
    const password = 'fakepassword';
    component.form.setValue({ username, password });
    const button = fixture.debugElement.query(By.css('button'));

    // Act
    button.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.directive(MatError));

    // Assert
    expect(authenticationServiceMock.login).not.toHaveBeenCalled();
    expect(error.nativeElement.textContent.trim()).toEqual('Please provide a valid email address');
  });

  it('should not login when the user submits and password is not provided', async () => {
    // Arrange
    const username = 'fake@user.com';
    const password = '';
    component.form.setValue({ username, password });
    const button = fixture.debugElement.query(By.css('button'));

    // Act
    button.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.directive(MatError));

    // Assert
    expect(authenticationServiceMock.login).not.toHaveBeenCalled();
    expect(error.nativeElement.textContent.trim()).toEqual('Please provide a valid password');
  });
});
