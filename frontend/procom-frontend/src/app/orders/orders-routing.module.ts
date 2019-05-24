import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersLayoutComponent } from '@app/orders/orders-layout/orders-layout.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
