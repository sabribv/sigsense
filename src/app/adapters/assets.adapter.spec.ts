import { Observable, of, throwError } from 'rxjs';
import { AssetsAdapter } from './assets.adapter';

const assetsCollectionResponse = {
    size: 2,
    items: [
        '/assets/1',
        '/assets/2',
    ],
    links: {
        previous: 'http://fake-previous',
        next: 'http://fake-next'
    },
    start: 1,
    limit: 2
};

const assetsResponses = [
    {
        name: 'asset1 name',
        description: 'asset1 description',
        manufacturer: 'asset1 manufacturer',
        href: 'http://asset1'
    },
    {
        name: 'asset2 name',
        description: 'asset2 description',
        manufacturer: 'asset2 manufacturer',
        href: 'http://asset2'
    }
];

const expectedResponse = {
    assets: [
        {
            name: 'asset1 name',
            description: 'asset1 description',
            manufacturer: 'asset1 manufacturer',
            image: jasmine.any(Observable)
        },
        {
            name: 'asset2 name',
            description: 'asset2 description',
            manufacturer: 'asset2 manufacturer',
            image: jasmine.any(Observable)
        }
    ],
    totalItems: 2,
    start: 1,
    limit: 2,
    previous: 'http://fake-previous',
    next: 'http://fake-next'
};

describe('AssetsAdapter', () => {
    let adapter: AssetsAdapter;
    const companyServiceMock = jasmine.createSpyObj('CompanyService', ['getAssetsListByRef', 'getAssetsListByCompany']);
    const assetsServiceMock = jasmine.createSpyObj('AssetService', ['getAsset', 'getAssetImage']);

    beforeEach(() => {
        adapter = new AssetsAdapter(companyServiceMock, assetsServiceMock);
        companyServiceMock.getAssetsListByRef.calls.reset();
        companyServiceMock.getAssetsListByCompany.calls.reset();
        assetsServiceMock.getAsset.calls.reset();
        assetsServiceMock.getAssetImage.calls.reset();
    });

    it('should return a return a list of assets when company id is provided and href is not', async () => {
        // Arrange}
        const companyId = 1;
        companyServiceMock.getAssetsListByCompany.and.returnValue(of(assetsCollectionResponse));
        assetsServiceMock.getAsset.and.returnValues(of(assetsResponses[0]), of(assetsResponses[1]));
        assetsServiceMock.getAssetImage.and.returnValue(of(jasmine.any(Observable)));

        // Act
        const response = await adapter.getCompanyAssets(companyId);

        // Assert
        expect(response).toEqual(expectedResponse);
        expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledTimes(1);
        expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledWith(companyId);
        expect(companyServiceMock.getAssetsListByRef).not.toHaveBeenCalled();
        expect(assetsServiceMock.getAsset).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/1');
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/2');
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledWith('http://asset1');
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledWith('http://asset2');
    });

    it('should return a return a list of assets when company id and href are provided', async () => {
        // Arrange}
        const companyId = 1;
        const href = 'http://fakeRef';
        companyServiceMock.getAssetsListByRef.and.returnValue(of(assetsCollectionResponse));
        assetsServiceMock.getAsset.and.returnValues(of(assetsResponses[0]), of(assetsResponses[1]));
        assetsServiceMock.getAssetImage.and.returnValue(of(jasmine.any(Observable)));

        // Act
        const response = await adapter.getCompanyAssets(companyId, href);

        // Assert
        expect(response).toEqual(expectedResponse);
        expect(companyServiceMock.getAssetsListByRef).toHaveBeenCalledTimes(1);
        expect(companyServiceMock.getAssetsListByRef).toHaveBeenCalledWith(href);
        expect(companyServiceMock.getAssetsListByCompany).not.toHaveBeenCalled();
        expect(assetsServiceMock.getAsset).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/1');
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/2');
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledWith('http://asset1');
        expect(assetsServiceMock.getAssetImage).toHaveBeenCalledWith('http://asset2');
    });

    it('should not return a return a list of assets when api call fails', async () => {
        // Arrange}
        const companyId = 1;
        companyServiceMock.getAssetsListByCompany.and.returnValue(throwError(''));

        try {
            // Act
            await adapter.getCompanyAssets(companyId);
        } catch {
            // Assert
            expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledTimes(1);
            expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledWith(companyId);
            expect(companyServiceMock.getAssetsListByRef).not.toHaveBeenCalled();
            expect(assetsServiceMock.getAsset).not.toHaveBeenCalled();
            expect(assetsServiceMock.getAssetImage).not.toHaveBeenCalled();
        }
    });
});
