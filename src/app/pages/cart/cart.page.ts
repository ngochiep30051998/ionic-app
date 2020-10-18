import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart, ICart } from 'src/app/interfaces/cart.interfaces';
import { IMenu } from 'src/app/interfaces/menu.interfaces';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { IProduct } from 'src/app/interfaces/products.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  public show = true;
  public amountOptions: any = {
    header: 'Số lượng',
    translucent: true,
    'css-class': 'css-class'
  };
  public floorOptions: any = {
    header: 'Chọn tầng nhận đồ',
    translucent: true
  };
  public floors = ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4', 'Tầng 5', 'Tầng 6', 'Tầng 7', 'Tầng 8'];
  compareWith: any;
  public cart: ICart;
  public cart$: Subscription;
  public menu: IMenu;
  public menuSub$: Subscription;
  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    public helperService: HelperService,
    public navCtrl: NavController,
  ) {
    this.cart = this.cartService.getCartFromStorage();
    this.cart$ = this.cartService.getCart().subscribe((res: ICart) => {
      if (res) {
        this.cart = new Cart(res.products);
      }
    });
    this.getMenu();
  }

  ngOnInit() {
  }

  getMenu() {
    if (this.menuSub$) {
      this.menuSub$.unsubscribe();
    }
    let id;
    if (environment.curentDate) {
      id = moment(environment.curentDate).format('DD-MM-YYYY');
    } else {
      id = moment(new Date()).format('DD-MM-YYYY');
    }
    this.helperService.showLoading();
    this.menuSub$ = this.firebaseService.getMenuById(id).subscribe((res) => {
      console.log(res);
      this.menu = res;
      this.helperService.hideLoading();

    }, err => {
      this.helperService.hideLoading();
    }, () => {
      this.helperService.hideLoading();
    });
  }

  compareFn(q: number, q1: number): boolean {
    return q === q1;
  }

  changeAmount(event, product: IProduct) {
    const currentProduct: IProduct = this.menu[product.meal].find(x => x.key === product.key);
    const amount = event.target.value ? Number(event.target.value) : 0;
    this.cartService.update(product, amount, currentProduct);
  }

  removeProduct(product: IProduct) {
    this.cartService.remove(product, product.amount);
  }
  goBack() {
    this.navCtrl.back();
  }
  ngOnDestroy(): void {
    if (this.cart$) {
      this.cart$.unsubscribe();
    }
  }
}
