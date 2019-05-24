import { TestBed, inject } from '@angular/core/testing';

import { LoggingService } from '@app/core/services/logging.service';

describe('LoggingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingService]
    });
  });

  it('should be created', inject([LoggingService], (service: LoggingService) => {
    expect(service).toBeTruthy();
  }));
});
