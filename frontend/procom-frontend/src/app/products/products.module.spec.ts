import { ProductsModule } from '@app/products/products.module';

describe('ProductsModule', () => {
  let productsModule: ProductsModule;

  beforeEach(() => {
    productsModule = new ProductsModule();
  });

  it('should create an instance', () => {
    expect(productsModule).toBeTruthy();
  });
});
