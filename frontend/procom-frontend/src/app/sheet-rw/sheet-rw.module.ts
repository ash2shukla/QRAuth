import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetRwMainComponent } from '@app/sheet-rw/sheet-rw-main/sheet-rw-main.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SheetRwMainComponent],
  exports: [SheetRwMainComponent]
})
export class SheetRwModule { }
