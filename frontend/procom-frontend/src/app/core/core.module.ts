import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogComponent } from '@app/core/log/log.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LogComponent],
  exports: [LogComponent]
})
export class CoreModule { }
