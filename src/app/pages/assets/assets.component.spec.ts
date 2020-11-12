import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatTable, MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { AssetsListBuilder } from 'src/app/services/assets-list-builder';
import { AssetsList } from 'src/app/models/asset';
import { CompanyHelperService } from 'src/app/services/company-helper.service';
import { AssetsComponent } from './assets.component';

const assetsList = {
  assets: [{
    name: 'fake asset name',
    description: 'fake asset description',
    manufacturer: 'fake asset manufacturer',
    image: of(jasmine.any(Observable))
  }],
  totalItems: 3,
  start: 1,
  limit: 1,
  previous: 'http://previous',
  next: 'http://next'
} as AssetsList;

const company = { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] };

describe('AssetsComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;
  const companyHelperServiceMock = jasmine.createSpyObj('CompanyHelperService', [],
    { ['selectedCompany']: of(company) });
  const assetsListBuilderMock = jasmine.createSpyObj('AssetsListBuilder', ['getAssetsList']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsComponent ],
      imports: [ BrowserAnimationsModule, MatProgressSpinnerModule, MatIconModule, MatTableModule, MatButtonModule ],
      providers: [
        { provide: CompanyHelperService, useValue: companyHelperServiceMock },
        { provide: AssetsListBuilder, useValue: assetsListBuilderMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    assetsListBuilderMock.getAssetsList.calls.reset();
  });

  it('should render the assets components and show a table with assets when there are assets for the company', async () => {
    // Arrange
    assetsListBuilderMock.getAssetsList.and.returnValue(Promise.resolve(assetsList));

    // Act
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(MatTable));

    // Assert
    expect(component).toBeTruthy();
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledTimes(1);
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledWith(company.id, null);
    expect(table).toBeTruthy();
  });

  it('should show a message when there are not assets for the company', async () => {
    // Arrange
    assetsListBuilderMock.getAssetsList.and.returnValue(Promise.resolve({ assets: []}));

    // Act
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(MatTable));
    const message = fixture.debugElement.query(By.css('.message'));

    // Assert
    expect(message.nativeElement.textContent).toContain('There are no assets available yet!');
    expect(table).toBeFalsy();
  });

  it('should show a message when assets service fails', async () => {
    // Arrange
    assetsListBuilderMock.getAssetsList.and.returnValue(Promise.reject());

    // Act
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(MatTable));
    const message = fixture.debugElement.query(By.css('.message'));

    // Assert
    expect(message.nativeElement.textContent).toContain('Oops! Something went wrong!');
    expect(table).toBeFalsy();
  });

  it('should show a spinner when data is loading', async () => {
    // Arrange
    component.currentStatus = component.status.loading;

    // Act
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.directive(MatSpinner));
    const table = fixture.debugElement.query(By.directive(MatTable));
    const message = fixture.debugElement.query(By.css('.message'));

    // Assert
    expect(message).toBeFalsy();
    expect(table).toBeFalsy();
    expect(spinner).toBeTruthy();
  });

  it('should get the next page of assets when the user click on the next button', async () => {
    // Arrange
    assetsListBuilderMock.getAssetsList.and.returnValue(Promise.resolve(assetsList));

    // Act
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const nextButton = fixture.debugElement.queryAll(By.css('.table-footer button'))[1];
    nextButton.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(component).toBeTruthy();
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledTimes(2);
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledWith(company.id, null);
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledWith(company.id, assetsList.next);
  });

  it('should get the previous page of assets when the user click on the previous button', async () => {
    // Arrange
    assetsListBuilderMock.getAssetsList.and.returnValue(Promise.resolve(assetsList));

    // Act
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const nextButton = fixture.debugElement.queryAll(By.css('.table-footer button'))[0];
    nextButton.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(component).toBeTruthy();
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledTimes(2);
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledWith(company.id, null);
    expect(assetsListBuilderMock.getAssetsList).toHaveBeenCalledWith(company.id, assetsList.previous);
  });
});
