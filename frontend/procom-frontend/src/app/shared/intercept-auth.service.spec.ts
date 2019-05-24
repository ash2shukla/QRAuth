import { TestBed, inject } from '@angular/core/testing';

import { InterceptAuthService } from '@app/shared/intercept-auth.service';

describe('InterceptAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterceptAuthService]
    });
  });

  it('should be created', inject([InterceptAuthService], (service: InterceptAuthService) => {
    expect(service).toBeTruthy();
  }));
});
