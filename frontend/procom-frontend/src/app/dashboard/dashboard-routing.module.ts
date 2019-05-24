import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardLayoutComponent } from '@app/dashboard/board-layout/board-layout.component';


const routes: Routes = [
  {
    path: '',
    component: BoardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'product'
      },
      {
        path: 'product',
        loadChildren: '@app/products/products.module#ProductsModule',
      },
      {
        path: 'order',
        loadChildren: '@app/orders/orders.module#OrdersModule',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
