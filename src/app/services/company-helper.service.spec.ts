import { take } from 'rxjs/operators';
import { CompanyHelperService } from './company-helper.service';

describe('CompanyHelperService', () => {
    let service: CompanyHelperService;
    const sessionStorageServiceMock = jasmine.createSpyObj('SessionStorageService', ['add', 'get']);

    beforeEach(() => {
        sessionStorageServiceMock.add.calls.reset();
        sessionStorageServiceMock.get.calls.reset();
    });

    it('should set companies when the service is created and companies are already stored in the local storage', (done) => {
        // Arrange
        const encryptedData = 'W3siaWQiOjIsIm5hbWUiOiJhbm90aGVyIGZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6MSwibmFtZSI6ImZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX1d';
        const companies = [
            { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] }
        ];

        sessionStorageServiceMock.get.and.returnValue(encryptedData);

        // Act
        service = new CompanyHelperService(sessionStorageServiceMock);

        // Assert
        expect(sessionStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.get).toHaveBeenCalledWith('metadata');
        expect(sessionStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.add).toHaveBeenCalledWith('metadata', encryptedData);

        service.availableCompanies.pipe(take(1)).subscribe(availableCompanies => {
            expect(availableCompanies).toEqual(companies);
            done();
        });

        service.selectedCompany.pipe(take(1)).subscribe(company => {
            expect(company).toEqual(companies[0]);
            done();
        });
    });

    it('should not set companies when there are not companies stored in the local storage', () => {
        // Arrange
        sessionStorageServiceMock.get.and.returnValue(undefined);

        // Act
        service = new CompanyHelperService(sessionStorageServiceMock);

        // Assert
        expect(sessionStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.get).toHaveBeenCalledWith('metadata');
        expect(sessionStorageServiceMock.add).not.toHaveBeenCalled();
    });

    it('should set the available companies when there is new data to store', (done) => {
        // Arrange
        const encryptedData = 'W3siaWQiOjIsIm5hbWUiOiJhbm90aGVyIGZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6MSwibmFtZSI6ImZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6MywibmFtZSI6ImZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX0seyJpZCI6NCwibmFtZSI6InlldCBhbm90aGVyIGZha2UgY29tcGFueSIsImRhc2hib2FyZHMiOlsiRmFrZSBkYXNoYm9hcmQiXX1d';
        const companies = [
            { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 3, name: 'fake company', dashboards: [ 'Fake dashboard' ] },
            { id: 4, name: 'yet another fake company', dashboards: [ 'Fake dashboard' ] }
        ];
        sessionStorageServiceMock.get.and.returnValue(undefined);

        // Act
        service = new CompanyHelperService(sessionStorageServiceMock);
        service.setCompanies(companies);

        // Assert
        expect(sessionStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.get).toHaveBeenCalledWith('metadata');
        expect(sessionStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.add).toHaveBeenCalledWith('metadata', encryptedData);

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
        sessionStorageServiceMock.get.and.returnValue(undefined);

        // Act
        service = new CompanyHelperService(sessionStorageServiceMock);
        service.setSelectedCompany(company);

        // Assert
        service.selectedCompany.pipe(take(1)).subscribe(selectedCompany => {
            expect(selectedCompany).toEqual(company);
            done();
        });
    });
});
