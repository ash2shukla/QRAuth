import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from '@app/dashboard/dashboard-routing.module';
import { BoardLayoutComponent } from '@app/dashboard/board-layout/board-layout.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,

    SharedModule
  ],
  declarations: [BoardLayoutComponent]
})
export class DashboardModule { }
