import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetService } from './asset.service';

describe('AssetService', () => {
    let service: AssetService;
    const httpMock = jasmine.createSpyObj('HttpClient', ['get']);
    const domSanitizerMock = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    beforeEach(() => {
        service = new AssetService(httpMock, domSanitizerMock);
        httpMock.get.calls.reset();
        domSanitizerMock.bypassSecurityTrustUrl.calls.reset();
    });

    it('should get asset details from API when getAsset is called', async () => {
        // Arrange
        const responseMock = 'response';
        const asset = '/asset';
        httpMock.get.and.returnValue(of(responseMock));

        // Act
        const response = await service.getAsset(asset).toPromise();

        // Assert
        expect(response).toEqual(responseMock);
        expect(httpMock.get).toHaveBeenCalledTimes(1);
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
})