import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@app/shared/auth-guard.service';

const routes: Routes = [
  // Angular bug workaround: Unable to navigate to root from within CanLoad
  {
    path: 'redirectToRoot',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    // canLoad: [AuthGuardService],
    // canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
