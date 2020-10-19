import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './number-only.directive';
import { ErrorDirective } from './error.directive';

@NgModule({
  declarations: [
    NumberOnlyDirective,
    ErrorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberOnlyDirective,
    ErrorDirective
  ]
})
export class DirectivesModule { }
