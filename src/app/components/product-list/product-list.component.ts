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
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoDetail(product?) {
    this.router.navigate(['/product-detail']);
  }
  trackByFn(index, item) {
    return item.key;
  }
}

