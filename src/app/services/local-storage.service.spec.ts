import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        service = new LocalStorageService();
    });

    it('should set a new local storage item when adding data', () => {
        // Arrange
        const key = 'fake key';
        const item = 'fake item';

        spyOn(localStorage, 'setItem');

        // Act
        service.add(key, item);

        // Assert
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(key, item);
    });

    it('should get an existing item from local storage when required', () => {
        // Arrange
        const key = 'fake key';
        const item = 'fake item';

        spyOn(localStorage, 'getItem').and.returnValue(item);

        // Act
        const response = service.get(key);

        // Assert
        expect(response).toEqual(item);
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should remove an existing item from local storage when not needed anymore', () => {
        // Arrange
        const key = 'fake key';

        spyOn(localStorage, 'removeItem');

        // Act
        service.remove(key);

        // Assert
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should clear local storage data when not needed anymore', () => {
        // Arrange
        spyOn(localStorage, 'clear');

        // Act
        service.clear();

        // Assert
        expect(localStorage.clear).toHaveBeenCalledTimes(1);
    });
});
