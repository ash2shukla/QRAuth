import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { SignupService } from '@app/signup/signup.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LogoutService } from '@app/shared/logout.service';
import { SignupProcessedResponseModel, AlreadyExistsModel, VerifyOTPProcessedResponseModel } from '@app/signup/signup.model';
import { LoggingService } from '@app/core/services/logging.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { map } from 'rxjs/operators';
import { StorageService } from '@app/core';
import { TdCollapseAnimation } from '@covalent/core';



class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control.parent.invalid && control.touched;
  }
}


@Component({
  selector: 'app-form-signup',
  templateUrl: './form-signup.component.html',
  styleUrls: ['./form-signup.component.scss'],
  animations: [TdCollapseAnimation()]
})
export class FormSignupComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router, private storage: StorageService, private logout: LogoutService, private logger: LoggingService) { }

  collapseState = true;

  signupStepperIconList: string[] = ['face', 'business_center', 'security', 'email', 'call', 'vpn_key'];

  isLinear = true;
  signupForm: FormGroup;
  signupResponse: SignupProcessedResponseModel;
  confirmValidParentMatcher: ConfirmValidParentMatcher = new ConfirmValidParentMatcher();
  verifyOTPResponse: VerifyOTPProcessedResponseModel;

  userId: string;

  emailExists: AlreadyExistsModel;
  mobileExists: AlreadyExistsModel;

  otpFormControl: FormControl;

  ngOnInit() {
    const mobileRegex = '[0-9]{10}';
    const otpRegex = '[0-9]{6}';

    this.emailExists = {status: false, message: ''};
    this.mobileExists = {status: false, message: ''};
    this.signupForm = this.fb.group({
      name: this.fb.group({
        first_name: [ '', [ Validators.required, Validators.maxLength(100)] ],
        last_name: [ '', Validators.maxLength(100) ]
      }),
      email: [ '', [ Validators.required, Validators.email], this.validateEmailUnique.bind(this) ],
      mobile: [ '', [ Validators.required, Validators.pattern(mobileRegex)], this.validateMobileUnique.bind(this) ],
      business_name: [ '', Validators.required ],
      password: this.fb.group({
        password: [ '', [ Validators.required, Validators.maxLength(50), Validators.minLength(8) ] ],
        repeatPassword : [ '', [ Validators.required ] ]
      }, {validator: this.validateRepeatPassword})
    });

    this.otpFormControl = this.fb.control('', [ Validators.required, Validators.pattern(otpRegex) ] );
  }

  validateRepeatPassword(group: FormGroup) {
    if (group.get('password').value === group.get('repeatPassword').value) {
      return null;
    } else {
      return {mismatch: true};
    }
  }

  validateEmailUnique(control: AbstractControl) {
    if (control.hasError('required') || control.hasError('email')) {
      return null;
    } else {
      return this.signupService.doesEmailExist({email: control.value}).pipe(
        map(
          (res) => res.body.email === '' ? {emailTaken: true} : null
        )
      );
    }
  }

  validateMobileUnique(control: AbstractControl) {
    if (control.hasError('required') || control.hasError('pattern')) {
      return null;
    } else {
      return this.signupService.doesMobileExist({mobile: control.value}).pipe(
        map(
          (res) => res.body.mobile === '' ? {mobileTaken: true} : null
        )
      );
    }
  }

  getFirstNameErrorMessage() {
    const firstNameFieldControl = this.signupForm.get('name').get('first_name');

    if ( firstNameFieldControl.hasError('required') ) {
      return 'You must enter a value.';
    } else if ( firstNameFieldControl.hasError('maxlength') ) {
      return 'Thats a pretty big name';
    }
  }

  getLastNameErrorMessage() {
    const lastNameFieldControl = this.signupForm.get('name').get('last_name');

    if ( lastNameFieldControl.hasError('maxlength') ) {
      return 'Thats a pretty big last name';
    }
  }

  getEmailErrorMessage() {
    const emailFieldControl = this.signupForm.get('email');

    if ( emailFieldControl.hasError('required') ) {
      return 'You must enter a value.';
    } else if ( emailFieldControl.hasError('email') ) {
      return 'Please enter a valid email';
    } else if ( emailFieldControl.hasError('emailTaken') ) {
      return 'Email unavailable';
    }
  }

  getMobileErrorMessage() {
    const mobileFieldControl = this.signupForm.get('mobile');

    if ( mobileFieldControl.hasError('required') ) {
      return 'You must enter a value.';
    } else if ( mobileFieldControl.hasError('pattern') ) {
      return 'Please enter a valid mobile';
    } else if ( mobileFieldControl.hasError('mobileTaken') ) {
      return 'Mobile unavailable';
    }
  }

  getBusinessNameErrorMessage() {
    const businessNameFieldControl = this.signupForm.get('business_name');

    if ( businessNameFieldControl.hasError('required') ) {
      return 'You must enter a value.';
    } else if ( businessNameFieldControl.hasError('maxlength') ) {
      return 'Thats a pretty big businessname';
    }
  }

  getPasswordErrorMessage() {
    const passwordFieldControl = this.signupForm.get('password').get('password');

    if ( passwordFieldControl.hasError('required') ) {
      return 'You must enter a value.';
    } else if ( passwordFieldControl.hasError('maxlength') ) {
      return 'Too big';
    } else if ( passwordFieldControl.hasError('minlength') ) {
      return 'Too small, must have at least 8 characters';
    }

  }

  getPasswordGroupErrorMessage() {
    const passwordFromGroup = this.signupForm.get('password');

    if ( passwordFromGroup.hasError('mismatch') ) {
      return 'Password and repeat must be equal.';
    }

  }

  getRepeatPasswordErrorMessage() {
    const repeatPasswordFormControl = this.signupForm.get('password').get('repeatPassword');

    if ( repeatPasswordFormControl.hasError('required') ) {
      return 'You must enter a value.';
    }

  }

  getOtpErrorMessage() {
    if (this.otpFormControl.hasError('required')) {
      return 'You must enter a value.';
    } else if (this.otpFormControl.hasError('pattern')) {
      return 'OTP is numeric 6 digit';
    }
  }

  signupSubmit() {
    this.logout.logoutServer();
    if (this.signupForm.valid) {
      const modSignupForm = this.signupForm.value;
      delete modSignupForm.name;
      modSignupForm.password = this.signupForm.get('password').get('password').value;
      modSignupForm.first_name = this.signupForm.get('name').get('first_name').value;
      modSignupForm.last_name = this.signupForm.get('name').get('last_name').value;

      const signupObservable  = this.signupService.signupInit(modSignupForm);
      signupObservable.subscribe(
        (data) => {
          if (data.ok && data.status === 200) {
              this.userId = data.body.id;
              this.collapseState = false;
              this.signupResponse = { code: 200, message: 'Signup Init OTP generated success.' };
          } else {
            this.signupResponse = { code: 300, message: 'Unexpected response.' };
          }
        },

        (err: HttpErrorResponse) => {
          if (err.status === 500 && err.error.detail === 'OTP send failed.') {
              this.signupResponse = { code: 500, message: 'OTP send failed.' };
          } else if (err.status === 0) {
            // Backend is not responding
            this.signupResponse = { code: 0, message: 'Server down.' };
          } else if (err.status === 400) {
            // Some error occured in backend
            this.signupResponse = { code: 400, message: 'Invalid form.'};
            if ( err.error.mobile && err.error.mobile.indexOf('This field must be unqiue.')  ) {
              this.mobileExists = {status: true, message: 'Mobile already exists.'};
            } else if ( err.error.email && err.error.email.indexOf('This field must be unqiue.') ) {
              this.emailExists = {status: true, message: 'Email already exists.'};
            }
          } else {
            // Some error occured in backend
            this.signupResponse = { code: 500, message: 'Server error.'};
          }
        },

        () => console.log('request completed')
      );
    }
  }

  otpSubmit() {
    if (this.otpFormControl.valid) {
      const verifyOTPForm = {otp: this.otpFormControl.value, id: this.userId};
      this.signupService.verifyOTP(verifyOTPForm).subscribe(
        (data) => {
          if (data.ok && data.status === 201) {
            this.verifyOTPResponse = { code: 200, message: 'Signup Complete.'};
            this.storage.saveIter(data.body);
            this.router.navigate(['/dashboard']);
          } else {
            this.verifyOTPResponse = { code: 300, message: 'Unexpected response.'};
          }
        },

        (err) => {
          if (err.error.detail === 'otp did not match.') {
            this.verifyOTPResponse = { code: 400, message: 'OTP mismatch.'};
          } else if (err.error.detail === 'otp expired.') {
            this.verifyOTPResponse = { code: 400 , message: 'OTP expired.'};
          } else if (err.status === 500 ) {
            this.verifyOTPResponse = { code: 500, message: 'Server error.'};
          } else if (err.status === 0 ) {
            this.verifyOTPResponse = { code: 0, message: 'Server down.'};
          } else {
            this.verifyOTPResponse = { code: 500, message: 'Unexpected response.'};
          }
        }
      );
    }
  }

}
