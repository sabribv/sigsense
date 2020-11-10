import { Injectable } from '@angular/core';

export enum StorageType {
    JSON,
    String
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    add(key: string, item: any, type: StorageType = StorageType.String): void {
        if (type === StorageType.JSON) {
            localStorage.setItem(key, JSON.stringify(item));
        } else {
            localStorage.setItem(key, item);
        }
    }

    get(key: string, type: StorageType = StorageType.String): any {
        let value = '';
        if (type === StorageType.JSON) {
            value = JSON.parse(localStorage.getItem(key));
        } else {
            value = localStorage.getItem(key);
        }

        return value;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
