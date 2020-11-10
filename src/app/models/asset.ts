export interface Asset {
    name: string;
    description: string;
    manufacturer: string;
    image: any;
}

export interface AssetsList {
    assets: Asset[];
    totalItems: number;
    start: number;
    limit: number;
    previous: string;
    next: string;
}
