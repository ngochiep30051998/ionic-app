import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


import { HomeResultsPage } from './home-results.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: HomeResultsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeResultsPage],
  entryComponents: [NotificationsComponent]
})
export class HomeResultsPageModule { }
