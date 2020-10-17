import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/products.interface';

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
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoDetail(product: IProduct) {
    this.router.navigate(['/product-detail', this.menuId, this.meal, product.key]);
  }
  trackByFn(index, item) {
    return item.key;
  }
}

