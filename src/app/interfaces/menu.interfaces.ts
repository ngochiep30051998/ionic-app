import { IProduct } from './products.interface';

export interface IMenu {
    breakfast?: IProduct[];
    lunch?: IProduct[];
    drinks?: IProduct[];
    id?: string;
}
