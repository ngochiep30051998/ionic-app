import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderDetailComponent } from 'src/app/components/order-detail/order-detail.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }
  async open(order?){
    const modal = await this.modalController.create({
      component: OrderDetailComponent,
      componentProps: { value: order }
    });
    return await modal.present();
  }
}
