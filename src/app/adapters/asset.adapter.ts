import { Injectable } from '@angular/core';
import { Adapter } from '../models/adapter';
import { Asset } from '../models/asset';
import { get } from 'lodash';
import { of } from 'rxjs';

@Injectable()
export class AssetAdapter implements Adapter<Asset> {
    adapt(data: any): Asset {
        return {
            href: get(data, 'href', ''),
            name: get(data, 'name', ''),
            description: get(data, 'description', ''),
            manufacturer: get(data, 'manufacturer', ''),
            image: get(data, 'image', of(undefined)),
        } as Asset;
    }
}
