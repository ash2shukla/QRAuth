import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '@app/signup/signup.model';
import { LoggingService } from '@app/core/services/logging.service';
import { Observable } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { SignupResponseModel, AuthResponseModel, OtpModel, MobileModel, EmailModel } from '@app/signup/signup.model';
import { environment } from '@env/environment';
import { retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient, private logger: LoggingService) { }

  signupInit(signupForm: SignupModel): Observable<HttpResponse<SignupResponseModel>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<SignupResponseModel>(environment.API_BASE_URL + 'auth/signup/', signupForm,  {observe: 'response', headers: new HttpHeaders({isUnauthed: 'T'}) });
  }

  verifyOTP(otpForm: OtpModel): Observable<HttpResponse<AuthResponseModel>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<AuthResponseModel>(environment.API_BASE_URL + 'auth/verify-otp/', otpForm, {observe: 'response', headers: new HttpHeaders({isUnauthed: 'T'}) });
  }

  doesMobileExist(mobile: MobileModel): Observable<HttpResponse<MobileModel>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<MobileModel>(environment.API_BASE_URL + 'auth/does-mobile-exist/', mobile, {observe: 'response', headers: new HttpHeaders({isUnauthed: 'T'}) });
  }

  doesEmailExist(email: EmailModel): Observable<HttpResponse<EmailModel>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<EmailModel>(environment.API_BASE_URL + 'auth/does-email-exist/', email, {observe: 'response', headers: new HttpHeaders({isUnauthed: 'T'}) });
  }
}
