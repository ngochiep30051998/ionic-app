import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PopmenuComponent } from './popmenu/popmenu.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    ProductListComponent,
    PopmenuComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
    NotificationsComponent,
    ProductListComponent,
    PopmenuComponent,
    OrderDetailComponent
  ],
  entryComponents: [
    NotificationsComponent,
    OrderDetailComponent
  ]
})
export class ComponentsModule { }
