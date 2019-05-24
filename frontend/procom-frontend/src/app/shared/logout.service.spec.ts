import { TestBed, inject } from '@angular/core/testing';

import { LogoutService } from '@app/shared/logout.service';

describe('LogoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogoutService]
    });
  });

  it('should be created', inject([LogoutService], (service: LogoutService) => {
    expect(service).toBeTruthy();
  }));
});
