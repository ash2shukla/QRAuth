import { Component, OnInit, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { timer, of } from 'rxjs';
import { mergeMap, take, map, switchMap } from 'rxjs/operators';
import { LoggingService } from '@app/core/services/logging.service';
import { environment } from '@env/environment';
import { StorageService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-signin',
  templateUrl: './qr-signin.component.html',
  styleUrls: ['./qr-signin.component.scss']
})
export class QrSigninComponent implements OnInit, OnDestroy {

  qr: string;
  ws: any;
  ws_repeater: any;

  constructor(private storage: StorageService, private logger: LoggingService, private router: Router) { }

  ngOnInit() {
    this.ws = webSocket(environment.WS_BASE_URL + 'anon-ws/');
    this.ws.subscribe(
      (qrEvent) => {
        switch (qrEvent.event) {
          case 'login_qr':
            this.qr = 'data:image/png;base64,' + qrEvent.qr;
            break;

          case 'activate_session':
            this.storage.saveIter(qrEvent.session_data);
            this.router.navigate(['/dashboard']);
            break;
        }

      },
      (err) => console.log('error', err),
      () => console.log('complete')
    );

    // 12 tries in 5 seconds

    this.ws_repeater = this.createQRRepeat(5000, 100).subscribe();

  }

  createQRRepeat(interval_time, pause_after) {
    return timer(0, interval_time).pipe(
      take(pause_after),
      mergeMap( () => of( this.ws.next( JSON.stringify({event: 'qr'})) ) )
    );
  }

  restartQR() {

  }

  ngOnDestroy() {
    this.ws.complete();
    this.ws_repeater.complete();
  }
}
