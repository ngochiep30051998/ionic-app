export interface ICalendar {
    id: string;
    title: string;
    isCurrent?: boolean;
}

export interface IResponseData {
    data: any[];
}

export interface IPhoto {
    key?: string;
    value?: string;
}