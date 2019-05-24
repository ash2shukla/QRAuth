import { Component, OnInit } from '@angular/core';
import { LoggingService } from '@app/core/services/logging.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  logs: any[] = [];
  constructor(private logger: LoggingService) { }

  ngOnInit() {
    this.logger.getLogger().subscribe(
      (data) => this.logs.push(data)
    );
  }

  trackByFn(idx, val) {
    return idx;
  }

}
