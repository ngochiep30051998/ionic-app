import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PopmenuComponent } from './popmenu/popmenu.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    NotificationsComponent,
    ProductListComponent,
    PopmenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    NotificationsComponent,
    ProductListComponent,
    PopmenuComponent
  ],
  entryComponents: [
    NotificationsComponent
  ]
})
export class ComponentsModule { }
