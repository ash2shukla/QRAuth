import { Component, OnInit } from '@angular/core';
import { TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  // tslint:disable-next-line:max-line-length
  animations: [TdCollapseAnimation({anchor: 'instantCollapse', duration: 200}), TdCollapseAnimation({anchor: 'delayedCollapse', delay: 200, duration: 200})]
})
export class HomeLayoutComponent implements OnInit {

 constructor() { }

  ngOnInit() { }

  get activeTheme(): string {
    return localStorage.getItem('theme');
  }

  theme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

}
