import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PercentagePipe } from './percentage.pipe';
import { FilterMenuPipe } from './filter-menu.pipe';

@NgModule({
  declarations: [
    PercentagePipe,
    FilterMenuPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PercentagePipe,
    FilterMenuPipe
  ]
})
export class PipesModule { }
