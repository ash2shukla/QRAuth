import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsLayoutComponent } from '@app/products/products-layout/products-layout.component';

describe('ProductsLayoutComponent', () => {
  let component: ProductsLayoutComponent;
  let fixture: ComponentFixture<ProductsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
