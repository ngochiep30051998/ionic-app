import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/products.interface';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() title: string;
  @Input() products: IProduct[] = [];
  @Input() menuId: string;
  @Input() meal: string;

  public curentDate: string;
  constructor(
    private router: Router,
    public cartService: CartService
  ) {
    this.curentDate = environment.curentDate ?
      moment(environment.curentDate).format('DD-MM-YYYY') :
      moment().format('DD-MM-YYYY');
  }

  ngOnInit() {
  }

  gotoDetail(product: IProduct) {
    this.router.navigate(['/product-detail', this.menuId, this.meal, product.key]);
  }
  trackByFn(index, item) {
    return item.key;
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart(product, 1);
  }
}

