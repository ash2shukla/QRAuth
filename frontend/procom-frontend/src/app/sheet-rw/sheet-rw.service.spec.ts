import { TestBed, inject } from '@angular/core/testing';

import { SheetRwService } from '@app/sheet-rw/sheet-rw.service';

describe('SheetRwService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SheetRwService]
    });
  });

  it('should be created', inject([SheetRwService], (service: SheetRwService) => {
    expect(service).toBeTruthy();
  }));
});
