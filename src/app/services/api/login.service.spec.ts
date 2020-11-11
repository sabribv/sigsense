import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

describe('LoginService', () => {
    let service: LoginService;
    const httpMock = jasmine.createSpyObj('HttpClient', ['put']);

    beforeEach(() => {
        service = new LoginService(httpMock);
        httpMock.put.calls.reset();
    });

    it('should login user when login is called', async () => {
        // Arrange
        const responseMock = 'response';
        const email = 'email';
        const password = 'password';
        httpMock.put.and.returnValue(of(responseMock));

        // Act
        const response = await service.login(email, password).toPromise();

        // Assert
        expect(response).toEqual(responseMock);
        expect(httpMock.put).toHaveBeenCalledTimes(1);
        expect(httpMock.put).toHaveBeenCalledWith(environment.endpoints.login, { email, password });
    });
});
