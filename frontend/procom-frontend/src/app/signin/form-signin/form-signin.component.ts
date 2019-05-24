import { Component, OnInit } from '@angular/core';
import { SigninService } from '@app/signin/signin.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SigninProcessedResponseModel } from '@app/signin/signin-form.model';
import { StorageService } from '@app/core/services/storage.service';
import { Router } from '@angular/router';
import { LogoutService } from '@app/shared/logout.service';


@Component({
  selector: 'app-form-signin',
  templateUrl: './form-signin.component.html',
  styleUrls: ['./form-signin.component.scss']
})
export class FormSigninComponent implements OnInit {

  signinForm: FormGroup;
  signinResponse: SigninProcessedResponseModel;

  // tslint:disable-next-line:max-line-length
  constructor(private signinService: SigninService, private logout: LogoutService, private fb: FormBuilder, private storage: StorageService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    const emailRegex = '[A-Za-z0-9_\.]+@[A-Za-z]+\.[A-Za-z]+';
    const mobileRegex = '[0-9]{10}';
    const emailOrMobile = `${emailRegex}|${mobileRegex}`;

    this.signinForm = this.fb.group({
      id_field: [ '', [Validators.required, Validators.pattern(emailOrMobile)] ],
      password: [ '', [Validators.required, Validators.maxLength(50), Validators.minLength(8)] ],
    });
  }

  signinSubmit() {
    this.logout.logoutServer();
    if (this.signinForm.valid) {
      const signinObservable  = this.signinService.signin(this.signinForm.value);
      signinObservable.subscribe(
        (data) => {
          if (data.ok && data.status === 200) {
              this.signinResponse = { code: 200, message: 'Signin success.' };
              this.storage.saveIter(data.body);
              this.router.navigate(['/dashboard']);
          } else {
            this.signinResponse = { code: 300, message: 'Unexpected response.' };
          }
        },

        (err: HttpErrorResponse) => {
          if (err.status === 401) {
            // Incorrect signin
            this.signinResponse = { code: 401, message: 'Incorrect signin.' };
          } else if (err.status === 0) {
            // Backend is not responding
            this.signinResponse = { code: 0, message: 'Server down.' };
          } else {
            // Some error occured in backend
            this.signinResponse = { code: 500, message: 'Server error.' };
          }
        },

        () => console.log('request completed')
      );
    }
  }

  getIdFieldErrorMessage() {
    const idFieldControl = this.signinForm.get('id_field');

    if ( idFieldControl.hasError('required') ) {
      // Change this value to change the error message for id_field required
      return 'You must enter a value.';
    } else if ( idFieldControl.hasError('pattern') ) {
      // Change this value to change the error message for id_field mobile/ email
      return 'Must be a valid mobile or email';
    }
  }

  getPasswordErrorMessage() {
    const passwordControl = this.signinForm.get('password');

    if ( passwordControl.hasError('required') ) {
      // Change this value to change the error message for password required
      return 'You must enter a value.';
    } else if ( passwordControl.hasError('minlength') ) {
      // Change this value to change the error message for password too short
      return 'Too small';
    } else if ( passwordControl.hasError('maxlength') ) {
      // Change this value to change the error message for password too big
      return 'Too big';
    }
  }

}
