import { Observable, of } from 'rxjs';
import { Asset } from '../models/asset';
import { AssetAdapter } from './asset.adapter';

describe('AssetAdapter', () => {
    it('should adapt data and return an asset', () => {
        // Arrange
        const adapter = new AssetAdapter();
        const data = {
            href: 'http://fakeRef',
            name: 'fake asset name',
            description: 'fake asset description',
            image: jasmine.any(Observable),
            other: 'other fake data'
        } as any;

        const expectedResult = {
            href: 'http://fakeRef',
            name: 'fake asset name',
            description: 'fake asset description',
            manufacturer: '',
            image: of(jasmine.any(Observable))
        } as Asset;

        // Act
        const result = adapter.adapt(data);

        // Assert
        expect(result).toEqual(expectedResult);
    });
});
