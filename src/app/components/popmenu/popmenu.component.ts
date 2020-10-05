import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'popmenu',
  templateUrl: './popmenu.component.html',
  styleUrls: ['./popmenu.component.scss']
})
export class PopmenuComponent implements OnInit {
  openMenu: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    ) { }

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

}
