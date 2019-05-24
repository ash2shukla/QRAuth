import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRwMainComponent } from '@app/sheet-rw/sheet-rw-main/sheet-rw-main.component';

describe('SheetRwMainComponent', () => {
  let component: SheetRwMainComponent;
  let fixture: ComponentFixture<SheetRwMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetRwMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetRwMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
