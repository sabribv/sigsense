import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    add(key: string, item: any): void {
        localStorage.setItem(key, item);
    }

    get(key: string): any {
        return localStorage.getItem(key);
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
