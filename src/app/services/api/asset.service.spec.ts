import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetService } from './asset.service';

describe('AssetService', () => {
    let service: AssetService;
    const assetAdapterMock = jasmine.createSpyObj('AssetAdapter', ['adapt']);
    const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
    const domSanitizerMock = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    beforeEach(() => {
        service = new AssetService(httpMock, assetAdapterMock, domSanitizerMock);
        httpMock.get.calls.reset();
        domSanitizerMock.bypassSecurityTrustUrl.calls.reset();
        assetAdapterMock.adapt.calls.reset();
    });

    it('should get asset details from API when getAsset is called', async () => {
        // Arrange
        const apiResponseMock = 'fake response';
        const adapterResponseMock = {
            href: 'http://fakeRef',
            name: 'fake asset name',
            description: 'fake asset description',
            manufacturer: '',
            image: of(jasmine.any(Observable))
        };
        const asset = '/asset';
        httpMock.get.and.returnValue(of(apiResponseMock));
        assetAdapterMock.adapt.and.returnValue(adapterResponseMock);

        // Act
        const response = await service.getAsset(asset).toPromise();

        // Assert
        expect(response).toEqual(adapterResponseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(2);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.server}${asset}`);
    });

    it('should get asset iamge from API when getAssetImage is called', async () => {
        // Arrange
        const responseMock = 'blob';
        const createObjectURLResponse = 'some object url';
        const asset = '/asset';
        httpMock.get.and.returnValue(of(jasmine.any(Blob)));
        domSanitizerMock.bypassSecurityTrustUrl.and.returnValue(responseMock);
        spyOn(URL, 'createObjectURL').and.returnValue(createObjectURLResponse);

        // Act
        const response = await service.getAssetImage(asset).toPromise();

        // Assert
        expect(response).toEqual(responseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(`${environment.endpoints.server}${asset}/image`, { responseType: 'blob' });
        expect(domSanitizerMock.bypassSecurityTrustUrl).toHaveBeenCalledTimes(1);
        expect(domSanitizerMock.bypassSecurityTrustUrl).toHaveBeenCalledWith(createObjectURLResponse);
    });
});
