import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() title: string;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoDetail(product?) {
    this.router.navigate(['/product-detail']);
  }
}
