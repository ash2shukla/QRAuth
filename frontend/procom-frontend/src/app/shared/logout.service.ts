import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '@app/core';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { LoggingService } from '@app/core/services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient, private storage: StorageService, private router: Router, private logger: LoggingService) { }

  logoutLocal() {
    this.storage.delete('token');
    this.storage.delete('refresh_token');
    this.storage.delete('session_key');
    this.router.navigate(['/redirectToRoot']);
  }

  logoutServer() {
    this.http.get(environment.API_BASE_URL + 'auth/signout/', {observe: 'response'}).subscribe(
      (data) => this.logoutLocal(),
      (err) => this.logoutLocal()
    );
  }
}
