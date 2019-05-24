import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninModule } from '@app/signin';
import { SignupModule } from '@app/signup';


import { HomeRoutingModule } from '@app/home/home-routing.module';
import { HomeLayoutComponent } from '@app/home/home-layout/home-layout.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,

    SigninModule,
    SignupModule
  ],
  declarations: [HomeLayoutComponent]
})
export class HomeModule { }
