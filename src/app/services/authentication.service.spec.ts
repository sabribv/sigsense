import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;

    const loginServiceMock = jasmine.createSpyObj('LoginService', ['login']);
    const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['add', 'get', 'clear']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const companyBuilderServiceMock = jasmine.createSpyObj('CompanyBuilderService', ['buildCompanies']);

    beforeEach(() => {
        service = new AuthenticationService(loginServiceMock, localStorageServiceMock, routerMock, companyBuilderServiceMock);
        loginServiceMock.login.calls.reset();
        localStorageServiceMock.add.calls.reset();
        localStorageServiceMock.get.calls.reset();
        localStorageServiceMock.clear.calls.reset();
        routerMock.navigate.calls.reset();
        companyBuilderServiceMock.buildCompanies.calls.reset();
    });

    it('should authenticate user when login is successful', async (done) => {
        // Arrange
        const loginApiResponse = {
            token: 'fake token',
            roles: 'fake roles'
        };
        const email = 'fake email';
        const password = 'fake password';

        loginServiceMock.login.and.returnValue(of(loginApiResponse));

        // Act
        await service.login(email, password);

        // Assert
        expect(loginServiceMock.login).toHaveBeenCalledTimes(1);
        expect(loginServiceMock.login).toHaveBeenCalledWith(email, password);
        expect(localStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.add).toHaveBeenCalledWith('token', loginApiResponse.token);
        expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledTimes(1);
        expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledWith(loginApiResponse.roles);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['assets']);

        service.authenticationStatus.pipe(take(1)).subscribe((isAuthenticated) => {
            expect(isAuthenticated).toBeTruthy();
            done();
        });
    });

    it('should not authenticate user when login fails', async (done) => {
        // Arrange
        const email = 'fake email';
        const password = 'fake password';

        loginServiceMock.login.and.returnValue(throwError(''));

        try {
            // Act
            await service.login(email, password);
        } catch {
            // Assert
            expect(loginServiceMock.login).toHaveBeenCalledTimes(1);
            expect(loginServiceMock.login).toHaveBeenCalledWith(email, password);
            expect(localStorageServiceMock.add).not.toHaveBeenCalled();
            expect(localStorageServiceMock.clear).toHaveBeenCalledTimes(1);
            expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledTimes(1);
            expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledWith([]);
            expect(routerMock.navigate).not.toHaveBeenCalled();

            service.authenticationStatus.pipe(take(1)).subscribe((isAuthenticated) => {
                expect(isAuthenticated).toBeFalsy();
                done();
            });
        }
    });

    it('should return that the user is authenticated when the token is stored in the local storage', () => {
        // Arrange
        localStorageServiceMock.get.and.returnValue('fake token');

        // Act
        const response = service.isAuthenticated();

        // Assert
        expect(response).toBeTruthy();
        expect(localStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.get).toHaveBeenCalledWith('token');
    });

    it('should return that the user is not authenticated when the token is not stored in the local storage', () => {
        // Arrange
        localStorageServiceMock.get.and.returnValue(undefined);

        // Act
        const response = service.isAuthenticated();

        // Assert
        expect(response).toBeFalsy();
        expect(localStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(localStorageServiceMock.get).toHaveBeenCalledWith('token');
    });

    it('should clear data and navigate to login when user logs out', (done) => {
        // Act
        service.logout();

        // Assert
        expect(localStorageServiceMock.clear).toHaveBeenCalledTimes(1);
        expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledTimes(1);
        expect(companyBuilderServiceMock.buildCompanies).toHaveBeenCalledWith([]);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['login']);

        service.authenticationStatus.pipe(take(1)).subscribe((isAuthenticated) => {
            expect(isAuthenticated).toBeFalsy();
            done();
        });
    });
});
