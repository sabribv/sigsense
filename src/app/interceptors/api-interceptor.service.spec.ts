import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiInterceptorService } from './api-interceptor.service';

describe('ApiInterceptorService', () => {
    let interceptor: ApiInterceptorService;
    const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', ['getToken']);

    beforeEach(() => {
        interceptor = new ApiInterceptorService(authenticationServiceMock);
        authenticationServiceMock.getToken.calls.reset();
    });

    it('should add access token to request headers when user doesnt navigate to login', () => {
        // Arrange
        const token = 'fakeToken';
        const originalRequest = new HttpRequest<any>('GET', 'fakeUrl', 'fake body');
        const expectedRequest = originalRequest.clone({
            setHeaders: {
                'x-access-token': token
            },
            body: originalRequest.body
        });
        authenticationServiceMock.getToken.and.returnValue(token);
        const observable = new Observable<HttpEvent<any>>();
        const handler = { handle: (): Observable<HttpEvent<any>> => (observable) } as HttpHandler;
        spyOn(handler, 'handle').and.returnValue(observable);

        // Act
        const response = interceptor.intercept(originalRequest, handler);

        // Assert
        expect(response).toEqual(observable);
        expect(authenticationServiceMock.getToken).toHaveBeenCalledTimes(1);
        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(handler.handle).toHaveBeenCalledWith(expectedRequest);
    });

    it('should not add access token to request headers when user navigates to login', () => {
        // Arrange
        const originalRequest = new HttpRequest<any>('GET', environment.endpoints.login, 'fake body');
        const observable = new Observable<HttpEvent<any>>();
        const handler = { handle: (): Observable<HttpEvent<any>> => (observable) } as HttpHandler;
        spyOn(handler, 'handle').and.returnValue(observable);

        // Act
        const response = interceptor.intercept(originalRequest, handler);

        // Assert
        expect(response).toEqual(observable);
        expect(authenticationServiceMock.getToken).not.toHaveBeenCalled();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(handler.handle).toHaveBeenCalledWith(originalRequest);
    });
});
