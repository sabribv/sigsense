import { Observable } from 'rxjs';
import { AssetsList } from '../models/asset';
import { AssetsListAdapter } from './assets-list.adapter';

describe('AssetsListAdapter', () => {
    it('should adapt data and return a list of assets', () => {
        // Arrange
        const adapter = new AssetsListAdapter();
        const data = {
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

        const expectedResult = {
            assets: [
                { href: '/assets/1' },
                { href: '/assets/2' }
            ],
            totalItems: 2,
            start: 1,
            limit: 2,
            previous: 'http://fake-previous',
            next: 'http://fake-next'
        } as AssetsList;

        // Act
        const result = adapter.adapt(data);

        // Assert
        expect(result).toEqual(expectedResult);
    });
});
