import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, EMPTY, throwError } from 'rxjs';
import { StorageService } from '@app/core';
import { catchError, switchMap, first } from 'rxjs/operators';
import { LogoutService } from '@app/shared/logout.service';
import { environment } from '@env/environment';
import { LoggingService } from '@app/core/services/logging.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptAuthService implements HttpInterceptor {

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private storage: StorageService, private logout: LogoutService, private logger: LoggingService) { }

  refreshToken(): Observable<boolean> {
    const authValues = this.storage.getAuthValues();
    const refreshed = new Subject<any>();

    this.http.post<HttpResponse<any>>( environment.API_BASE_URL + 'auth/refresh/',
      {'token': authValues.token, 'refresh_token': authValues.refresh_token},
      // tslint:disable-next-line:max-line-length
      {headers: new HttpHeaders({'X-Session-Key': authValues.session_key, isUnauthed: 'T'}), observe: 'response', responseType: 'json'}).subscribe(
        (response) => {
          if (response.status === 200) {
            this.storage.saveIter(response.body);
            refreshed.next(true);
          } else {
            refreshed.next(false);
          }
        },

        (err) => refreshed.next(false)
      );

    return refreshed.asObservable().pipe( first() );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestHeaders = request.headers;
    const isUnauthed = requestHeaders.get('isUnauthed');
    requestHeaders = requestHeaders.delete('isUnauthed');

    if (isUnauthed !== 'T') {
      const authValues = this.storage.getAuthValues();

      if (authValues.token == null || authValues.session_key == null) {
        this.logout.logoutLocal();
        return next.handle(request);
      } else {
        requestHeaders = requestHeaders.set('Authorization', 'JWT ' + authValues.token);
        requestHeaders = requestHeaders.set('X-Session-Key', authValues.session_key);
      }
    }

    const modReq = request.clone({
      headers: requestHeaders
    });

    return next.handle(modReq).pipe(
      catchError(
        (err) => {
          if (err.error.detail === 'Signature has expired.') {
            this.logger.log('ping');
            return this.refreshToken().pipe(
              switchMap(
                (response) => {
                  if (response) {
                    const retryReq = modReq.clone({ headers: modReq.headers.set('Authorization', 'JWT ' + this.storage.get('token'))});
                    return next.handle(retryReq);
                  } else {
                    return EMPTY;
                  }
                },
              )
            );
          } else if (err.error.detail === 'Session expired.') {
            this.logout.logoutLocal();
            return EMPTY;
          } else if (err.error.detail === 'Refresh token mismatch.') {
            return EMPTY;
          } else {
            return throwError(err);
          }
        }
      )
    );
  }

}
