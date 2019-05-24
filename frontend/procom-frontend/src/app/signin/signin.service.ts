import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import { environment } from '@env/environment';

import { SigninModel, SigninResponseModel } from '@app/signin/signin-form.model';

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable()
export class SigninService {

  constructor(private http: HttpClient) { }

  signin(signinForm: SigninModel): Observable<HttpResponse<SigninResponseModel>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<SigninResponseModel>(environment.API_BASE_URL + 'auth/signin/', signinForm , {observe: 'response', headers: new HttpHeaders({isUnauthed: 'T'}) }).pipe( retry(3) );
  }

}
