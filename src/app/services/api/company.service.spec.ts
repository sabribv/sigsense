import { Observable, of } from 'rxjs';
import { AssetsList } from 'src/app/models/asset';
import { environment } from 'src/environments/environment';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
    let service: CompanyService;
    const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
    const assetsListAdapterMock = jasmine.createSpyObj('AssetsListAdapter', ['adapt']);

    beforeEach(() => {
        service = new CompanyService(httpMock, assetsListAdapterMock);
        httpMock.get.calls.reset();
    });

    it('should get an assets list when getAssetsListByCompany is called', async () => {
        // Arrange
        const apiResponseMock = 'fake response';
        const adapterResponseMock = {
            assets: [
                {
                    name: 'asset1 name',
                    description: 'asset1 description',
                    manufacturer: 'asset1 manufacturer',
                    image: of(jasmine.any(Observable))
                },
                {
                    name: 'asset2 name',
                    description: 'asset2 description',
                    manufacturer: 'asset2 manufacturer',
                    image: of(jasmine.any(Observable))
                }
            ],
            totalItems: 2,
            start: 1,
            limit: 2,
            previous: 'http://fake-previous',
            next: 'http://fake-next'
        } as AssetsList;
        const companyId = 1;
        httpMock.get.and.returnValue(of(apiResponseMock));
        assetsListAdapterMock.adapt.and.returnValue(adapterResponseMock);

        // Act
        const response = await service.getAssetsListByCompany(companyId).toPromise();

        // Assert
        expect(response).toEqual(adapterResponseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.companies}/${companyId}/assets`);
    });

    it('should get an assets list when getAssetsListByRef is called', async () => {
        // Arrange
        const apiResponseMock = 'fake response';
        const adapterResponseMock = {
            assets: [
                {
                    name: 'asset1 name',
                    description: 'asset1 description',
                    manufacturer: 'asset1 manufacturer',
                    image: of(jasmine.any(Observable))
                },
                {
                    name: 'asset2 name',
                    description: 'asset2 description',
                    manufacturer: 'asset2 manufacturer',
                    image: of(jasmine.any(Observable))
                }
            ],
            totalItems: 2,
            start: 1,
            limit: 2,
            previous: 'http://fake-previous',
            next: 'http://fake-next'
        } as AssetsList;
        const ref = 'ref';
        httpMock.get.and.returnValue(of(apiResponseMock));
        assetsListAdapterMock.adapt.and.returnValue(adapterResponseMock);

        // Act
        const response = await service.getAssetsListByRef(ref).toPromise();

        // Assert
        expect(response).toEqual(adapterResponseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.server}/${ref}`);
    });
});
