import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';
import { IProduct } from 'src/app/interfaces/products.interface';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

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
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router,
    public cartService: CartService,
    public toastCtrl: ToastController,

  ) {
    this.currentDate = environment.curentDate || formatDate(new Date(), 'dd-MM-yyyy', 'en');
    this.menuId = this.route.snapshot.paramMap.get('menuId');
    this.id = this.route.snapshot.paramMap.get('id');
    this.meal = this.route.snapshot.paramMap.get('meal');

    this.getProduct(this.menuId, this.meal, this.id);

  }

  ngOnInit() {
  }

  like() {
    console.log('like')
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
}
