import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
    let service: CompanyService;
    const httpMock = jasmine.createSpyObj('HttpClient', ['get']);

    beforeEach(() => {
        service = new CompanyService(httpMock);
        httpMock.get.calls.reset();
    });

    it('should get an assets list when getAssetsListByCompany is called', async () => {
        // Arrange
        const responseMock = 'response';
        const companyId = 1;
        httpMock.get.and.returnValue(of(responseMock));

        // Act
        const response = await service.getAssetsListByCompany(companyId).toPromise();

        // Assert
        expect(response).toEqual(responseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.companies}/${companyId}/assets`);
    });

    it('should get an assets list when getAssetsListByRef is called', async () => {
        // Arrange
        const responseMock = 'response';
        const ref = 'ref';
        httpMock.get.and.returnValue(of(responseMock));

        // Act
        const response = await service.getAssetsListByRef(ref).toPromise();

        // Assert
        expect(response).toEqual(responseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.server}/${ref}`);
    });
});
