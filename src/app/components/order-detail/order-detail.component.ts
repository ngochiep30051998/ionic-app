import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BILL_STATUS, PAYMENT_STATUS, TRANS_TYPE } from 'src/app/constants/common';
import { ICart } from 'src/app/interfaces/cart.interfaces';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  @Input() order: ICart;
  public BILL_STATUS = BILL_STATUS;
  public PAYMENT_STATUS = PAYMENT_STATUS;
  public TRANS_TYPE = TRANS_TYPE;
  
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.order)
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
