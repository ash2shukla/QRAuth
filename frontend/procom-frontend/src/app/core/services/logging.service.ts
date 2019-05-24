import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  logUpdate = new Subject<any>();

  log(arg: any) {
    this.logUpdate.next(arg);
  }

  getLogger() {
    return this.logUpdate.asObservable();
  }

}
