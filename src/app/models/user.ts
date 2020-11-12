import { Company } from './company';

export interface User {
    token: string;
    email: string;
    name: string;
    companies: Company[];
}
