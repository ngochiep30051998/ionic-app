import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BILL_STATUS, PAYMENT_STATUS, TRANS_TYPE } from 'src/app/constants/common';
import { ICart } from 'src/app/interfaces/cart.interfaces';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';

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
    public helperService: HelperService,
    private firebaseService: FirebaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,


  ) { }

  ngOnInit() {
    console.log(this.order)
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async cancelOrder() {
    const alert = await this.alertCtrl.create({
      header: 'Huỷ đơn hàng',
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng?',
      buttons: [
        {
          text: 'Huỷ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Xác nhận',
          handler: async (data) => {
            try {
              this.helperService.showLoading();
              await this.firebaseService.cancelOrder(this.order);
              this.showToast('success', 'Huỷ đơn hàng thành công');
              this.order.status = BILL_STATUS.canceled.key;
            } catch (e) {
              console.log(e);
              this.showToast('danger', 'Huỷ đơn hàng thất bại');
            } finally {
              this.helperService.hideLoading();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async showToast(type = 'success', message: any) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: type
    });
    toast.present();
  }
}
