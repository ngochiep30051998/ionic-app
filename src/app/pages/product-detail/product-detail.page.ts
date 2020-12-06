import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';
import { Subscription, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IProduct } from 'src/app/interfaces/products.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, OnDestroy {

  @ViewChild('Slides') slides: IonSlides;
  public slideOpts = {
    effect: 'flip'
  };
  liked = false;
  public menuId: string;
  public id: string;
  public product: IProduct;
  public photoIndex = 0;
  public meal: string;
  public currentDate;
  public user: IUser;
  public userSub$: Subscription;
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router,
    public cartService: CartService,
    public toastCtrl: ToastController,
    public angularFireAuth: AngularFireAuth,
    public helperService: HelperService

  ) {
    // tslint:disable-next-line: max-line-length
    this.currentDate = environment.curentDate ? formatDate(environment.curentDate, 'dd-MM-yyyy', 'en') : formatDate(new Date(), 'dd-MM-yyyy', 'en');
    this.menuId = this.route.snapshot.paramMap.get('menuId');
    this.id = this.route.snapshot.paramMap.get('id');
    this.meal = this.route.snapshot.paramMap.get('meal');

    this.getProduct(this.menuId, this.meal, this.id);

    this.userSub$ = this.angularFireAuth.user.pipe(
      mergeMap(user => {
        return user && user.uid ? this.firebaseService.getCurrentUserFirebase(user.uid) : EMPTY;
      })
    ).subscribe((res: IUser) => {
      this.user = res;
      if (this.user && this.user.favorites) {
        const key = this.helperService.getKeyByValue(this.user.favorites, this.id);
        this.liked = key ? true : false;
      } else {
        this.liked = false;
      }
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  like() {
    this.liked = !this.liked;
  }

  getProduct(menuId: string, meal: string, id: string) {
    this.firebaseService.getProductById(menuId, meal, id).subscribe((res: IProduct) => {
      console.log(res);
      this.product = res;
    });
  }

  slideChange(event) {
    this.slides.getActiveIndex().then((index: number) => {
      this.photoIndex = index;
    });
  }

  async addToCart() {
    if (this.product.amount > 0) {
      this.cartService.addToCart(this.product, 1);
      this.router.navigate(['/cart']);
    } else {
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
  }

  addFavarite() {
    this.firebaseService.addFavorite(this.user, this.product.id);
  }

  async removeFavarite() {
    if (this.user && this.user.favorites) {
      const key = this.helperService.getKeyByValue(this.user.favorites, this.id);
      const res = await this.firebaseService.removeFavorite(this.user, key);
      // this.liked = false;
    }
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }

}
