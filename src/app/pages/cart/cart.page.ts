import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { EMPTY, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { PAYMENT_STATUS, TRANS_TYPE } from 'src/app/constants/common';
import { Cart, ICart } from 'src/app/interfaces/cart.interfaces';
import { IError } from 'src/app/interfaces/errors.interfaces';
import { IMenu } from 'src/app/interfaces/menu.interfaces';
import { IProduct } from 'src/app/interfaces/products.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';


declare let vnpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy, AfterViewInit {
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

  public TRANS_TYPE = TRANS_TYPE;

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
    private apiService: ApiService,
    private iab: InAppBrowser,
    public angularFireAuth: AngularFireAuth,

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
    // this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
    //   this.user = res;

    // });
    //   this.firebaseService.getCurrentUserFirebase(this.angularFireAuth.auth.currentUser.uid)
    this.userSub$ = this.angularFireAuth.user.pipe(
      mergeMap(user => {
        return user && user.uid ? this.firebaseService.getCurrentUserFirebase(user.uid) : EMPTY;
      })
    ).subscribe((res: IUser) => {
      this.user = res;
      console.log(res);
    }, err => {
      console.log(err);
    });


    this.errorSub$ = this.cartService.getError().subscribe((res: IError[]) => {
      if (res) {
        this.errors = [...res];
      }
    });

    this.getMenu();
  }

  ngOnInit() {
    this.loadvnpay();
  }

  ngAfterViewInit(): void {
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
              text: 'Đăng nhập',
              handler: () => this.router.navigate(['/login'], { state: { checkout: true } })
            }
          ]
        });

        return await alert.present();
      }
      this.helperService.showLoading();
      const bill = new Cart(this.cart.products, '', this.form.value.notes, this.form.value.floor, this.form.value.transType, this.user);

      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đặt hàng thành công.',
        duration: 3000,
        position: 'bottom',
        color: 'success'
      });
      const err = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Thanh toán không thành công, vui lòng kiểm tra và nhập lại thông tin',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      console.log(bill);
      if (bill.payment === TRANS_TYPE.card) {
        const params = {
          amount: bill.totalPrice,
          orderDescription: bill.notes
        };
        const idToken = await this.authService.getIdToken();
        const create: any = await this.apiService.checkout(params, idToken);

        if (create.code === '00') {

          // vnpay.open({ width: 768, height: 600, url: create.data });
          const browser = this.iab.create(create.data, '_blank', {
            zoom: 'no',
            location: 'no',
            closebuttoncaption: 'Thoát',
            enableViewportScale: 'no',
            toolbarposition: 'top',
            hidenavigationbuttons: 'yes',
            lefttoright: 'no'
          });
          browser.on('loadstart').subscribe(async (event) => {
            console.log('browser closed', event);
            if (event.url.includes('vnp_ResponseCode')) {
              if (event.url.includes('vnp_ResponseCode=00')) {
                const url = new URL(event.url);
                const vnp_TransactionNo = url.searchParams.get('vnp_TransactionNo');
                bill.paymentStatus = PAYMENT_STATUS.success;
                bill.vnpayTransId = vnp_TransactionNo;
                const res = await this.firebaseService.createBill(bill);
                browser.close();
                toast.present();
                this.cartService.clearCart();
                this.router.navigate(['/home-results']);
              } else {
                err.present();
                browser.close();
              }
            }
          }, e => {
            err.present();
            browser.close();
          });
        } else {
          err.present();
        }
      } else {
        bill.paymentStatus = PAYMENT_STATUS.pending;
        delete bill.vnpayTransId;
        const create = await this.firebaseService.createBill(bill);
        console.log(create);
        toast.present();
        this.cartService.clearCart();
        this.router.navigate(['/home-results']);
      }


    } catch (e) {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đặt hàng thất bại',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      console.log(e);
    } finally {
      this.helperService.hideLoading();
    }
  }

  loadvnpay() {

    // if (!window.document.getElementById('vnpay-script')) {
    //   const s = window.document.createElement('script');
    //   s.id = 'vnpay-script';
    //   s.type = 'text/javascript';
    //   s.src = 'https://pay.vnpay.vn/lib/vnpay/vnpay.js';
    //   window.document.body.appendChild(s);
    // }
  }

  checkoutVNpay() {
    // if ((<any>window).vnpay) {
    //   vnpay.open({ width: 768, height: 600, url: x.data });
    // }
  }
  ngOnDestroy(): void {
    if (this.cart$) {
      this.cart$.unsubscribe();
    }
    if (this.errorSub$) {
      this.errorSub$.unsubscribe();
    }
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }

  ionViewWillLeave() {
    console.log(this.cart.products);
    if (this.cart && this.cart.products) {
      this.cart.products.forEach((cart, index) => {
        if (cart.amount < 1) {
          this.cart.products.splice(index, 1);
        }
      });

      this.cartService.updateCart(this.cart);
    }
  }
}
