import { TestBed, inject } from '@angular/core/testing';

import { SigninService } from '@app/signin/signin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SigninService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SigninService],
      imports : [HttpClientTestingModule]
    });
  });

  it('should be created', inject([SigninService], (service: SigninService) => {
    expect(service).toBeTruthy();
  }));
});
