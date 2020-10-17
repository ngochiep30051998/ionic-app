import { IPhoto } from './commont.interface';

export interface IProduct {
    catId?: string;
    catName?: string;
    displayImage?: string;
    id?: string;
    key?: string;
    name?: string;
    photos?: IPhoto[];
    price?: number;
    promotionPrice?: string;
    detail?: string;
    amount?: number;
    unit?: string;
}

export interface IDiglogData {
    type: string;
    data: any;
    extendData?: any;
}

export interface ICategories {
    key?: string;
    categoryName?: string;
    product?: IProduct[];
}

export interface IPopupData {
    tab: string;
    menuId: string;
    product?: IProduct;
    type?: string;
}
