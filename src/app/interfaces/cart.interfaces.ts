import { IProduct } from './products.interface';
import { IUser } from './user.interface';

export interface ICart {
    products?: IProduct[];
    promotionCode?: string;
    notes?: string;
    address?: string;
    payment?: string;
    totalItem?: number;
    totalPrice?: number;
    user?: IUser;
    date?: any;
}

export class Cart implements ICart {
    products?: IProduct[];
    promotionCode?: string;
    notes?: string;
    address?: string;
    payment?: string;
    totalItem?: number;
    totalPrice?: number;
    user?: IUser;
    constructor(
        products?: IProduct[],
        promotionCode?: string,
        notes?: string,
        address?: string,
        payment?: string,
        user?: IUser
    ) {
        this.products = products;
        this.promotionCode = promotionCode;
        this.notes = notes;
        this.address = address;
        this.payment = payment;
        this.totalItem = this.getTotalItem(products);
        this.totalPrice = this.getTotalPrice(products);
        this.user = user;
    }


    getTotalItem(products: IProduct[] = []) {
        let total = 0;
        for (const product of products) {
            total += product.amount;
        }
        return total;
    }

    getTotalPrice(products: IProduct[] = []) {
        let total = 0;
        for (const product of products) {
            total += product.promotionPrice ? product.promotionPrice * product.amount : product.price * product.amount;
        }
        return total;
    }

}


