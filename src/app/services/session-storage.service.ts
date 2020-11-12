import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    add(key: string, item: any): void {
        sessionStorage.setItem(key, item);
    }

    get(key: string): any {
        return sessionStorage.getItem(key);
    }

    remove(key: string): void {
        sessionStorage.removeItem(key);
    }

    clear(): void {
        sessionStorage.clear();
    }
}
