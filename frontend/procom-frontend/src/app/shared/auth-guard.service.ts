import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, CanActivate } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { first } from 'rxjs/operators';
import { LoggingService } from '@app/core/services/logging.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad, CanActivate {

  constructor(private router: Router, private http: HttpClient, private logger: LoggingService) { }

  canLoad(route: Route): Observable<boolean> {
    const response = new Subject<boolean>();
    // tslint:disable-next-line:max-line-length
    this.http.get(environment.API_BASE_URL + 'auth/verify-token/',  {observe: 'response'}).subscribe(
      (data) => {
        if (data.status === 200) {
          response.next(true);
        } else {
          this.router.navigate(['/redirectToRoot']);
          response.next(false);
        }
      },

      (err) => {
        this.router.navigate(['/redirectToRoot']);
        response.next(false);
      }
    );
    return response.asObservable().pipe( first() );
  }

  canActivate(): Observable<boolean> {
    const response = new Subject<boolean>();
    // tslint:disable-next-line:max-line-length
    this.http.get(environment.API_BASE_URL + 'auth/verify-token/',  {observe: 'response'}).subscribe(
      (data) => {
        if (data.status === 200) {
          response.next(true);
        } else {
          this.router.navigate(['/redirectToRoot']);
          response.next(false);
        }
      },

      (err) => {
        this.router.navigate(['/redirectToRoot']);
        response.next(false);
      }
    );
    return response.asObservable().pipe( first() );
  }

}
