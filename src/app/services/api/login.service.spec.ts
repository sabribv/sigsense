import { of } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

describe('LoginService', () => {
    let service: LoginService;
    const httpMock = jasmine.createSpyObj('HttpClient', ['put']);
    const userAdapterMock = jasmine.createSpyObj('UserAdapter', ['adapt']);

    beforeEach(() => {
        service = new LoginService(httpMock, userAdapterMock);
        httpMock.put.calls.reset();
        userAdapterMock.adapt.calls.reset();
    });

    it('should login user when login is called', async () => {
        // Arrange
        const apiResponseMock = 'fake response';
        const adapterResponseMock  = {
            token: 'fake token',
            email: 'fake@user.com',
            name: 'fake user name',
            companies: [ { id: 1, name: 'fake company name', dashboards: [ 'Fake dashboard' ] } ],
        } as User;
        const email = 'email';
        const password = 'password';
        httpMock.put.and.returnValue(of(apiResponseMock));
        userAdapterMock.adapt.and.returnValue(adapterResponseMock);

        // Act
        const response = await service.login(email, password).toPromise();

        // Assert
        expect(response).toEqual(adapterResponseMock);
        expect(httpMock.put).toHaveBeenCalledTimes(1);
        expect(httpMock.put).toHaveBeenCalledWith(environment.endpoints.login, { email, password });
    });
});
