import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'popmenu',
  templateUrl: './popmenu.component.html',
  styleUrls: ['./popmenu.component.scss']
})
export class PopmenuComponent implements OnInit, OnDestroy {
  openMenu: Boolean = false;
  public user: IUser;
  public userSub$: Subscription;
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private router: Router,
    private authService: AuthService,

  ) {

    this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
      this.user = res;
    });

  }

  ngOnInit() {
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  gotoPage(page) {
    this.router.navigate([page]);
  }

  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }
}
