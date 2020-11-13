import { IPhoto } from './common.interfaces';

export interface IProduct {
    catId?: string;
    catName?: string;
    displayImage?: string;
    id?: string;
    key?: string;
    name?: string;
    photos?: IPhoto[];
    price?: number;
    promotionPrice?: number;
    detail?: string;
    amount?: number;
    unit?: string;
    createdAt?: string;
    updatedAt?: string;
    meal?: string;
    menuId?: string;
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
