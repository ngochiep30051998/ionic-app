import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cart, ICart } from '../interfaces/cart.interfaces';
import { IProduct } from '../interfaces/products.interface';
import { Storage } from '@ionic/storage';
import { FirebaseService } from './firebase.service';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { IError } from '../interfaces/errors.interfaces';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart$: BehaviorSubject<ICart> = new BehaviorSubject(null);
  private cart: ICart;

  private error$: Subject<IError[]> = new Subject();
  private errors: IError[] = [];

  constructor(
    private storage: Storage,
    private firebaseService: FirebaseService,
    public toastCtrl: ToastController,

  ) {
    this.cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : new Cart([], '', '', '', '');
  }

  async addToCart(product: IProduct, amount: number) {
    try {
      if (!product.amount) {
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          closeButtonText: 'Đóng',
          message: 'Sản phẩm đã hết, vui lòng chọn sản phẩm khác.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        return await toast.present();
      }
      const index = this.cart.products.findIndex(x => x.key === product.key);
      if (index === -1) {
        // product.createdAt = moment(this.firebaseService.getTime()).format('YYYY-MM-DD HH:mm:ss');
        product.createdAt = moment().format('DD-MM-YYYY HH:mm:ss');
        // product.amount = amount;
        this.cart.products.push({ ...product, amount });
      } else {
        if (this.cart.products[index].amount + amount > product.amount) {
          const toast = await this.toastCtrl.create({
            showCloseButton: true,
            closeButtonText: 'Đóng',
            message: 'Sản phẩm trong rỏ hàng đã lớn hơn sản phẩm còn lại, vui lòng chọn thêm sản phẩm khác.',
            duration: 2000,
            position: 'bottom',
            color: 'danger'

          });
          return await toast.present();
        }
        this.cart.products[index].updatedAt = moment().format('DD-MM-YYYY HH:mm:ss');
        this.cart.products[index].amount += amount;

      }
      const success = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: `Đã thêm ${product.name} vào rỏ hàng.`,
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await success.present();

      const cart = new Cart(this.cart.products, '', '', '', '');
      localStorage.setItem('cart', JSON.stringify(cart));
      this.cart$.next(cart);
    } catch (e) {
      console.log(e);
    }
  }

  async update(product: IProduct, amount: number, currentProduct: IProduct) {
    try {
      if (!currentProduct) {
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          closeButtonText: 'Đóng',
          message: 'Sản phẩm đã hết hoặc không được bán trong ngày hôm nay.',
          duration: 2000,
          position: 'bottom'
        });
        return await toast.present();
      }
      if (amount > currentProduct.amount) {
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          closeButtonText: 'Đóng',
          message: `Sản phẩm ${product.name} trong rỏ hàng đã lớn hơn sản phẩm còn lại, vui lòng chọn thêm sản phẩm khác.`,
          duration: 2000,
          position: 'bottom'
        });

        this.setError({ id: product.id, message: 'Sản phẩm quá số lượng cho phép' });
        return await toast.present();
      } else {
        this.removeError(product.id);
        const index = this.cart.products.findIndex(x => x.key === product.key);
        this.cart.products[index].amount = amount;
        const cart = new Cart(this.cart.products, '', '', '', '');
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart$.next(cart);
      }
    } catch (e) {
      console.log(e);
    }
  }

  getCart() {
    return this.cart$.asObservable();
  }

  getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  async remove(product: IProduct, amount?: number) {
    const index = this.cart.products.findIndex(x => x.key === product.key);
    if (index > -1) {
      if (amount) {
        this.cart.products[index].amount -= amount;
      } else {
        this.cart.products[index].amount--;
      }
      if (this.cart.products[index].amount === 0) {
        this.cart.products.splice(index, 1);
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          closeButtonText: 'Đóng',
          message: `Sản phẩm đã được xoá khỏi rỏ hàng.`,
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      } else {
        this.cart.products[index].updatedAt = moment().format('DD-MM-YYYY HH:mm:ss');
      }
    }
    const cart = new Cart(this.cart.products, '', '', '', '');
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart$.next(cart);
  }

  getError() {
    return this.error$.asObservable();
  }
  setError(e: IError) {
    const index = this.errors.findIndex(x => x.id === e.id);
    if (index > -1) {
      this.errors[index] = e;
    } else {
      this.errors.push(e);
    }
    this.error$.next(this.errors);
  }

  removeError(id) {
    if (this.errors && this.errors.length > 0) {
      const index = this.errors.findIndex(x => x.id === id);
      if (index > -1) {
        this.errors.splice(index, 1);
        this.error$.next(this.errors);
      }
    }
  }

  clearCart() {
    localStorage.removeItem('cart');
    this.cart = null;
    this.errors = [];
    this.error$.next(this.errors);
    this.cart$.next(null);
  }
}
