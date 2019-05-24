import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSigninComponent } from '@app/signin/qr-signin/qr-signin.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('QrSigninComponent', () => {
  let component: QrSigninComponent;
  let fixture: ComponentFixture<QrSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrSigninComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
