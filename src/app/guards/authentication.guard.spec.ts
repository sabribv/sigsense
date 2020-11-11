import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
    let guard: AuthenticationGuard;
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']);

    beforeEach(() => {
        guard = new AuthenticationGuard(routerMock, authenticationServiceMock);
        routerMock.navigate.calls.reset();
        authenticationServiceMock.isAuthenticated.calls.reset();
    });

    it('should be able to navigate when user is authenticated', () => {
        // Arrange
        authenticationServiceMock.isAuthenticated.and.returnValue(true);

        // Act
        const response = guard.canActivate();

        // Assert
        expect(response).toBeTruthy();
        expect(authenticationServiceMock.isAuthenticated).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should be redirected to login when user is not authenticated', async () => {
        // Arrange
        authenticationServiceMock.isAuthenticated.and.returnValue(false);

        // Act
        const response = await guard.canActivate();

        // Assert
        expect(response).toBeFalsy();
        expect(authenticationServiceMock.isAuthenticated).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
    });
});
