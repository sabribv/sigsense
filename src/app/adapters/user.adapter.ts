import { Adapter } from '../models/adapter';
import { Company } from '../models/company';
import { User } from '../models/user';
import { get } from 'lodash';

export class UserAdapter implements Adapter<User> {
    adapt(data: any): User {
        const companies = get(data, 'roles', []).map((role: any) => {
            return {
                id: get(role, 'companyId', ''),
                name: get(role, 'companyName', ''),
                dashboards: get(role, 'Dashboards', [])
                    .map((dashboard: any) => dashboard.replace(/^\w/, (character) => character.toUpperCase()))
            } as Company;
        }).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        return {
            token: data.token,
            name: data.name,
            email: data.email,
            companies
        } as User;
    }
}
