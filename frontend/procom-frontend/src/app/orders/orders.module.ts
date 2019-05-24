import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersLayoutComponent } from './orders-layout/orders-layout.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ],
  declarations: [OrdersLayoutComponent]
})
export class OrdersModule { }
