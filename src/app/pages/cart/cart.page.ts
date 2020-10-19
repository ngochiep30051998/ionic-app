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
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IError } from 'src/app/interfaces/errors.interfaces';
import { Router } from '@angular/router';

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
  public cart: ICart;
  public cart$: Subscription;
  public menu: IMenu;
  public menuSub$: Subscription;
  public user: IUser;
  public userSub$: Subscription;

  public errors: IError[] = [];
  public errorSub$: Subscription;

  public form: FormGroup;
  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    public helperService: HelperService,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService,
    public toastCtrl: ToastController,
    private router: Router,
    public alertCtrl: AlertController,
  ) {
    this.form = this.fb.group({
      floor: ['Tầng 1'],
      notes: [''],
      transType: ['1']
    });
    this.cart = this.cartService.getCartFromStorage();
    this.cart$ = this.cartService.getCart().subscribe((res: ICart) => {
      if (res) {
        this.cart = new Cart(res.products);
      }
    });

    this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
      this.user = res;
    });

    this.errorSub$ = this.cartService.getError().subscribe((res: IError[]) => {
      if (res) {
        this.errors = [...res];
        console.log(this.errors);
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

  async submit() {
    try {
      if (this.errors.length > 0) {
        return;
      }
      if (!this.user) {
        const alert = await this.alertCtrl.create({
          header: 'Đăng nhập?',
          message: 'Bạn cần đăng nhập để đặt hàng.',
          buttons: [
            {
              text: 'Huỷ',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Xác nhận',
              handler: async () => this.router.navigate(['/login'], { state: { checkout: true } })
            }
          ]
        });

        return await alert.present();
      }
      this.helperService.showLoading();
      const bill = new Cart(this.cart.products, '', this.form.value.notes, this.form.value.floor, this.form.value.transType, this.user);
      console.log(bill);
      if (bill.payment === '2') {

      } else {
        const create = await this.firebaseService.createBill(bill);
        console.log(create);
      }
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đặt hàng thành công.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      this.cartService.clearCart();
      this.navCtrl.navigateRoot('/home-results');

    } catch (e) {
      console.log(e);
    } finally {
      this.helperService.hideLoading();
    }
  }

  ngOnDestroy(): void {
    if (this.cart$) {
      this.cart$.unsubscribe();
    }
    if (this.errorSub$) {
      this.errorSub$.unsubscribe();
    }
  }
}
