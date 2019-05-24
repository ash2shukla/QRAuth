import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormSigninComponent } from '@app/signin/form-signin/form-signin.component';
import { QrSigninComponent } from '@app/signin/qr-signin/qr-signin.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SigninService } from '@app/signin/signin.service';
import { SharedModule } from '@app/shared';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [SigninService],
  declarations: [ FormSigninComponent, QrSigninComponent ],
  exports: [ FormSigninComponent, QrSigninComponent ]
})
export class SigninModule { }
