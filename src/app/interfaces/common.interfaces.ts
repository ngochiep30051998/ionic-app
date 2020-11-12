import { IMenu } from "./menu.interfaces";

export interface ICalendar {
    id: string;
    title: string;
    isCurrent?: boolean;
    menu?: IMenu;
}

export interface IResponseData {
    data: any[];
}

export interface IPhoto {
    key?: string;
    value?: string;
}

export interface IFilter {
    maxPrice?: number;
    catId?: string;
    promotion?: any ;
    status?: any;
    meal?: any;
}

export interface ICategory {
    key: string;
    categoryName: string;
}
