import { SessionStorageService } from './session-storage.service';

describe('SessionStorageService', () => {
    let service: SessionStorageService;

    beforeEach(() => {
        service = new SessionStorageService();
    });

    it('should set a new local storage item when adding data', () => {
        // Arrange
        const key = 'fake key';
        const item = 'fake item';

        spyOn(sessionStorage, 'setItem');

        // Act
        service.add(key, item);

        // Assert
        expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
        expect(sessionStorage.setItem).toHaveBeenCalledWith(key, item);
    });

    it('should get an existing item from local storage when required', () => {
        // Arrange
        const key = 'fake key';
        const item = 'fake item';

        spyOn(sessionStorage, 'getItem').and.returnValue(item);

        // Act
        const response = service.get(key);

        // Assert
        expect(response).toEqual(item);
        expect(sessionStorage.getItem).toHaveBeenCalledTimes(1);
        expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should remove an existing item from local storage when not needed anymore', () => {
        // Arrange
        const key = 'fake key';

        spyOn(sessionStorage, 'removeItem');

        // Act
        service.remove(key);

        // Assert
        expect(sessionStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(sessionStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should clear local storage data when not needed anymore', () => {
        // Arrange
        spyOn(sessionStorage, 'clear');

        // Act
        service.clear();

        // Assert
        expect(sessionStorage.clear).toHaveBeenCalledTimes(1);
    });
});
