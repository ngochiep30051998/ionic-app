import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, NavController } from '@ionic/angular';
import { EMPTY, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OrderDetailComponent } from 'src/app/components/order-detail/order-detail.component';
import { BILL_STATUS } from 'src/app/constants/common';
import { ICart } from 'src/app/interfaces/cart.interfaces';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';

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
  private page = 0;
  private limit = 10;
  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    public navCtrl: NavController,
    public angularFireAuth: AngularFireAuth,
    public helperService: HelperService
  ) {
    // this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
    //   this.user = res;
    //   if (this.user) {
    //     this.getHistory();
    //   }
    // });
    this.userSub$ = this.angularFireAuth.user.pipe(
      mergeMap(user => {
        return user && user.uid ? this.firebaseService.getCurrentUserFirebase(user.uid) : EMPTY;
      })
    ).subscribe((res: IUser) => {
      this.user = res;
      if (this.user) {
        this.getHistory();
      }
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
  async open(order?) {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,
      componentProps: { order }
    });
    return await modal.present();
  }
  getHistory(event?) {
    if (this.historySub$) {
      this.historySub$.unsubscribe();
    }
    if (!event) {
      this.helperService.showLoading();
    }
    this.page = this.page === 0 ? 1 : this.page + 1;
    const count = this.limit * this.page;
    this.historySub$ = this.firebaseService.getOrderHistory(this.user, count).subscribe(res => {
      this.bills = res;
      if (event) {
        event.target.complete();
      }
      this.helperService.hideLoading();
    }, err => {
      this.helperService.hideLoading();
    });
  }

  trackByFn(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
    if (this.historySub$) {
      this.historySub$.unsubscribe();
    }
  }
}
