import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public show = true;
  customAlertOptions: any = {
    header: 'Select Quantity',
    translucent: true
  };
  floorOptions: any = {
    header: 'Chọn tầng nhận đồ',
    translucent: true
  };
  public floors = ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4', 'Tầng 5', 'Tầng 6', 'Tầng 7', 'Tầng 8'];
  constructor() { }

  ngOnInit() {
  }

}
