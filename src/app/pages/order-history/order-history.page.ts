import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderDetailComponent } from 'src/app/components/order-detail/order-detail.component';
import { BILL_STATUS } from 'src/app/constants/common';
import { ICart } from 'src/app/interfaces/cart.interfaces';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit, OnDestroy {

  public user: IUser;
  public userSub$: Subscription;
  private historySub$: Subscription;
  public bills: ICart[] = [];
  public BILL_STATUS = BILL_STATUS;
  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {
    this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
      this.user = res;
      console.log(this.user)
      if (this.user) {
        this.getHistory();
      }
    });

  }

  ngOnInit() {
  }
  async open(order?) {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,
      componentProps: { value: order }
    });
    return await modal.present();
  }
  getHistory() {
    if (this.historySub$) {
      this.historySub$.unsubscribe();
    }
    this.historySub$ = this.firebaseService.getOrderHistory(this.user).subscribe(res => {
      console.log(res);
      this.bills = res;
    });
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    };
    if (this.historySub$) {
      this.historySub$.unsubscribe();
    }
  }
}
