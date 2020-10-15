import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PopmenuComponent } from './popmenu/popmenu.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    NotificationsComponent,
    ProductListComponent,
    PopmenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
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
