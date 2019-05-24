import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LogoutService } from '@app/shared/logout.service';
import { TdMediaService } from '@covalent/core';
import { Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInLeft } from 'ng-animate';


@Component({
  selector: 'app-board-layout',
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss'],
  animations: [
    trigger('slide', [transition('* => *', useAnimation(slideInLeft, { params: { timing: 0.30, delay: 0 }} ) ) ] )
  ]
})
export class BoardLayoutComponent implements OnInit {

  constructor(private router: Router, private media: TdMediaService, private http: HttpClient, private logout: LogoutService) { }

  animateState = false;

  get activeTheme(): string {
    return localStorage.getItem('theme');
  }
  theme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  ngOnInit() { 
    this.router.events.subscribe((event) => {
      if(event.url) {
        this.animateState = ! this.animateState;
      }
    });
  }

  makeProtectedRequest() {
    this.http.get(environment.API_BASE_URL + 'auth/verify-token/', { observe: 'response'}).subscribe();
  }

  logoutUser() {
    this.logout.logoutServer();
  }

}
