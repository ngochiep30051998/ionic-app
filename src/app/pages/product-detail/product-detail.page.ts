import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { IProduct } from 'src/app/interfaces/products.interface';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {
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
}
