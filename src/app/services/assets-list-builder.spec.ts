import { Observable, of, throwError } from 'rxjs';
import { AssetsList } from '../models/asset';
import { AssetsListBuilder } from './assets-list-builder';

const assetsCollectionResponse = {
    totalItems: 2,
    assets: [
        { href: '/assets/1' },
        { href: '/assets/2' }
    ],
    previous: 'http://fake-previous',
    next: 'http://fake-next',
    start: 1,
    limit: 2
};

const assetsResponses = [
    {
        name: 'asset1 name',
        description: 'asset1 description',
        manufacturer: 'asset1 manufacturer',
        href: '/assets/1',
        image: jasmine.any(Observable)
    },
    {
        name: 'asset2 name',
        description: 'asset2 description',
        manufacturer: 'asset2 manufacturer',
        href: '/assets/2',
        image: jasmine.any(Observable)
    }
];

const expectedResponse = {
    assets: [
        {
            name: 'asset1 name',
            description: 'asset1 description',
            manufacturer: 'asset1 manufacturer',
            href: '/assets/1',
            image: of(jasmine.any(Observable))
        },
        {
            name: 'asset2 name',
            description: 'asset2 description',
            manufacturer: 'asset2 manufacturer',
            href: '/assets/2',
            image: of(jasmine.any(Observable))
        }
    ],
    totalItems: 2,
    start: 1,
    limit: 2,
    previous: 'http://fake-previous',
    next: 'http://fake-next'
} as AssetsList;

describe('AssetsListBuilder', () => {
    let adapter: AssetsListBuilder;
    const companyServiceMock = jasmine.createSpyObj('CompanyService', ['getAssetsListByRef', 'getAssetsListByCompany']);
    const assetsServiceMock = jasmine.createSpyObj('AssetService', ['getAsset']);

    beforeEach(() => {
        adapter = new AssetsListBuilder(companyServiceMock, assetsServiceMock);
        companyServiceMock.getAssetsListByRef.calls.reset();
        companyServiceMock.getAssetsListByCompany.calls.reset();
        assetsServiceMock.getAsset.calls.reset();
    });

    it('should return a return a list of assets when company id is provided and href is not', async () => {
        // Arrange}
        const companyId = 1;
        companyServiceMock.getAssetsListByCompany.and.returnValue(of(assetsCollectionResponse));
        assetsServiceMock.getAsset.and.returnValues(of(assetsResponses[0]), of(assetsResponses[1]));

        // Act
        const response = await adapter.getAssetsList(companyId);

        // Assert
        expect(response).toEqual(expectedResponse);
        expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledTimes(1);
        expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledWith(companyId);
        expect(companyServiceMock.getAssetsListByRef).not.toHaveBeenCalled();
        expect(assetsServiceMock.getAsset).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/1');
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/2');
    });

    it('should return a return a list of assets when company id and href are provided', async () => {
        // Arrange}
        const companyId = 1;
        const href = 'http://fakeRef';
        companyServiceMock.getAssetsListByRef.and.returnValue(of(assetsCollectionResponse));
        assetsServiceMock.getAsset.and.returnValues(of(assetsResponses[0]), of(assetsResponses[1]));

        // Act
        const response = await adapter.getAssetsList(companyId, href);

        // Assert
        expect(response).toEqual(expectedResponse);
        expect(companyServiceMock.getAssetsListByRef).toHaveBeenCalledTimes(1);
        expect(companyServiceMock.getAssetsListByRef).toHaveBeenCalledWith(href);
        expect(companyServiceMock.getAssetsListByCompany).not.toHaveBeenCalled();
        expect(assetsServiceMock.getAsset).toHaveBeenCalledTimes(2);
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/1');
        expect(assetsServiceMock.getAsset).toHaveBeenCalledWith('/assets/2');
    });

    it('should not return a return a list of assets when api call fails', async () => {
        // Arrange}
        const companyId = 1;
        companyServiceMock.getAssetsListByCompany.and.returnValue(throwError(''));

        try {
            // Act
            await adapter.getAssetsList(companyId);
        } catch {
            // Assert
            expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledTimes(1);
            expect(companyServiceMock.getAssetsListByCompany).toHaveBeenCalledWith(companyId);
            expect(companyServiceMock.getAssetsListByRef).not.toHaveBeenCalled();
            expect(assetsServiceMock.getAsset).not.toHaveBeenCalled();
        }
    });
});
