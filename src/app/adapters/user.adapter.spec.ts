import { Observable } from 'rxjs';
import { UserAdapter } from './user.adapter';

describe('UserAdapter', () => {
    it('should adapt data and return an asset', () => {
        // Arrange
        const adapter = new UserAdapter();
        const data = {
            token: 'fake token',
            email: 'fake@user.com',
            name: 'fake user name',
            roles: [
                { companyId: 1, companyName: 'fake company', Dashboards: [ 'fake dashboard' ] },
                { companyId: 2, companyName: 'another fake company', Dashboards: [ 'fake dashboard' ] },
                { companyId: 3, companyName: 'fake company', Dashboards: [ 'fake dashboard' ] },
                { companyId: 4, companyName: 'yet another fake company', Dashboards: [ 'fake dashboard' ] },
            ],
            other: 'other fake data'
        };

        const expectedResult = {
            token: 'fake token',
            email: 'fake@user.com',
            name: 'fake user name',
            companies: [
                { id: 2, name: 'another fake company', dashboards: [ 'Fake dashboard' ] },
                { id: 1, name: 'fake company', dashboards: [ 'Fake dashboard' ] },
                { id: 3, name: 'fake company', dashboards: [ 'Fake dashboard' ] },
                { id: 4, name: 'yet another fake company', dashboards: [ 'Fake dashboard' ] }
            ]
        };

        // Act
        const result = adapter.adapt(data);

        // Assert
        expect(result).toEqual(expectedResult);
    });
});
