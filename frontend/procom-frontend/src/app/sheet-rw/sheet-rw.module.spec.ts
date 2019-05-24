import { SheetRwModule } from '@app/sheet-rw/sheet-rw.module';

describe('SheetRwModule', () => {
  let sheetRwModule: SheetRwModule;

  beforeEach(() => {
    sheetRwModule = new SheetRwModule();
  });

  it('should create an instance', () => {
    expect(sheetRwModule).toBeTruthy();
  });
});
