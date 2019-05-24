import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSignupComponent } from '@app/signup/form-signup/form-signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [FormSignupComponent],
  exports: [FormSignupComponent]
})
export class SignupModule { }
