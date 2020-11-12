import { Injectable } from '@angular/core';
import { Adapter } from '../models/adapter';
import { AssetsList } from '../models/asset';
import { get } from 'lodash';

@Injectable()
export class AssetsListAdapter implements Adapter<AssetsList> {
    adapt(data: any): AssetsList {
        const assets = get(data, 'items', []).map((item: string) => ({ href: item}));
        return {
            assets,
            totalItems: get(data, 'size', ''),
            start: get(data, 'start', ''),
            limit: get(data, 'limit', ''),
            previous: get(data, 'links.previous', ''),
            next: get(data, 'links.next', '')
        } as AssetsList;
    }
}
