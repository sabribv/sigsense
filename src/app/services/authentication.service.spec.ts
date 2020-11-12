import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;

    const loginServiceMock = jasmine.createSpyObj('LoginService', ['login']);
    const sessionStorageServiceMock = jasmine.createSpyObj('SessionStorageService', ['add', 'get', 'clear']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const companyHelperServiceMock = jasmine.createSpyObj('CompanyHelperService', ['setCompanies']);

    beforeEach(() => {
        service = new AuthenticationService(loginServiceMock, sessionStorageServiceMock, routerMock, companyHelperServiceMock);
        loginServiceMock.login.calls.reset();
        sessionStorageServiceMock.add.calls.reset();
        sessionStorageServiceMock.get.calls.reset();
        sessionStorageServiceMock.clear.calls.reset();
        routerMock.navigate.calls.reset();
        companyHelperServiceMock.setCompanies.calls.reset();
    });

    it('should authenticate user when login is successful', async (done) => {
        // Arrange
        const loginApiResponse = {
            token: 'fake token',
            email: 'fake@user.com',
            name: 'fake user name',
            companies: [ { id: 1, name: 'fake company name', dashboards: [ 'Fake dashboard' ] } ],
        };
        const email = 'fake email';
        const password = 'fake password';

        loginServiceMock.login.and.returnValue(of(loginApiResponse));

        // Act
        await service.login(email, password);

        // Assert
        expect(loginServiceMock.login).toHaveBeenCalledTimes(1);
        expect(loginServiceMock.login).toHaveBeenCalledWith(email, password);
        expect(sessionStorageServiceMock.add).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.add).toHaveBeenCalledWith('token', loginApiResponse.token);
        expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledTimes(1);
        expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledWith(loginApiResponse.companies);
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
            expect(sessionStorageServiceMock.add).not.toHaveBeenCalled();
            expect(sessionStorageServiceMock.clear).toHaveBeenCalledTimes(1);
            expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledTimes(1);
            expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledWith([]);
            expect(routerMock.navigate).not.toHaveBeenCalled();

            service.authenticationStatus.pipe(take(1)).subscribe((isAuthenticated) => {
                expect(isAuthenticated).toBeFalsy();
                done();
            });
        }
    });

    it('should return that the user is authenticated when the token is stored in the local storage', () => {
        // Arrange
        sessionStorageServiceMock.get.and.returnValue('fake token');

        // Act
        const response = service.isAuthenticated();

        // Assert
        expect(response).toBeTruthy();
        expect(sessionStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.get).toHaveBeenCalledWith('token');
    });

    it('should return that the user is not authenticated when the token is not stored in the local storage', () => {
        // Arrange
        sessionStorageServiceMock.get.and.returnValue(undefined);

        // Act
        const response = service.isAuthenticated();

        // Assert
        expect(response).toBeFalsy();
        expect(sessionStorageServiceMock.get).toHaveBeenCalledTimes(1);
        expect(sessionStorageServiceMock.get).toHaveBeenCalledWith('token');
    });

    it('should clear data and navigate to login when user logs out', (done) => {
        // Act
        service.logout();

        // Assert
        expect(sessionStorageServiceMock.clear).toHaveBeenCalledTimes(1);
        expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledTimes(1);
        expect(companyHelperServiceMock.setCompanies).toHaveBeenCalledWith([]);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['login']);

        service.authenticationStatus.pipe(take(1)).subscribe((isAuthenticated) => {
            expect(isAuthenticated).toBeFalsy();
            done();
        });
    });
});
