import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsLayoutComponent } from '@app/products/products-layout/products-layout.component';
import { SharedModule } from '@app/shared';
import { ProductsRoutingModule } from '@app/products/products-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProductsRoutingModule
  ],
  declarations: [ProductsLayoutComponent],
  exports: [ProductsLayoutComponent]
})
export class ProductsModule { }
