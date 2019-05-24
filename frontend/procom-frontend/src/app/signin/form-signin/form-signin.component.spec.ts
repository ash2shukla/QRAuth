import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSigninComponent } from '@app/signin/form-signin/form-signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninService } from '@app/signin/signin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('FormSigninComponent', () => {
  let component: FormSigninComponent;
  let fixture: ComponentFixture<FormSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSigninComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule ],
      providers: [ SigninService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
