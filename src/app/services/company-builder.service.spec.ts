import { take } from 'rxjs/operators';
import { CompanyBuilderService } from './company-builder.service';

describe('CompanyBuilderService', () => {
    let service: CompanyBuilderService;
    const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['add', 'get']);

    beforeEach(() => {
        localStorageServiceMock.add.calls.reset();
        localStorageServiceMock.get.calls.reset();
    });

    it('should set companies when the service is created and companies are already stored in the local storage', (done) => {
        // Arrange
        const encryptedData = 'W3siaWQiOjIsIm5hbWUiOiJhbm90aGVyIGZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6MSwibmFtZSI6ImZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX1d';
        const companies = [
            { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] }
        ];

        localStorageServiceMock.get.and.returnValue(encryptedData);

        // Act
        service = new CompanyBuilderService(localStorageServiceMock);

        // Assert
        expect(localStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.get).toHaveBeenCalledWith('metadata');
        expect(localStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.add).toHaveBeenCalledWith('metadata', encryptedData);

        service.availableCompanies.pipe(take(1)).subscribe(availableCompanies => {
            expect(availableCompanies).toEqual(companies);
            done();
        });

        service.selectedCompany.pipe(take(1)).subscribe(company => {
            expect(company).toEqual(companies[0]);
            done();
        });
    });

    it('should set the available companies when there is new data to store', (done) => {
        // Arrange
        const encryptedData = 'W3siaWQiOjIsIm5hbWUiOiJhbm90aGVyIGZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6MSwibmFtZSI6ImZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX1d';
        const companies = [
            { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] }
        ];
        const roles = [
            { companyId: 1, companyName: 'fake company', Dashboards: [ 'fake dashboard' ] },
            { companyId: 2, companyName: 'another fake company', Dashboards: [ 'fake dashboard' ] }
        ];
        localStorageServiceMock.get.and.returnValue(undefined);

        // Act
        service = new CompanyBuilderService(localStorageServiceMock);
        service.buildCompanies(roles);

        // Assert
        expect(localStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.get).toHaveBeenCalledWith('metadata');
        expect(localStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.add).toHaveBeenCalledWith('metadata', encryptedData);

        service.availableCompanies.pipe(take(1)).subscribe(availableCompanies => {
            expect(availableCompanies).toEqual(companies);
            done();
        });

        service.selectedCompany.pipe(take(1)).subscribe(company => {
            expect(company).toEqual(companies[0]);
            done();
        });
    });

    it('should set the selected company when a company is selected', (done) => {
        // Arrange
        const company = { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] };
        localStorageServiceMock.get.and.returnValue(undefined);

        // Act
        service = new CompanyBuilderService(localStorageServiceMock);
        service.setSelectedCompany(company);

        // Assert
        service.selectedCompany.pipe(take(1)).subscribe(selectedCompany => {
            expect(selectedCompany).toEqual(company);
            done();
        });
    });
});
