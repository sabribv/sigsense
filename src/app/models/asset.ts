import { Observable } from 'rxjs';

export interface Asset {
    href: string;
    name: string;
    description: string;
    manufacturer: string;
    image: Observable<any>;
}

export interface AssetsList {
    assets: Asset[];
    totalItems: number;
    start: number;
    limit: number;
    previous: string;
    next: string;
}
