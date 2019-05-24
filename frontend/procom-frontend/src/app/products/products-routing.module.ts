import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsLayoutComponent } from '@app/products/products-layout/products-layout.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsLayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
