import { SigninModule } from '@app/signin/signin.module';

describe('SigninModule', () => {
  let signinModule: SigninModule;

  beforeEach(() => {
    signinModule = new SigninModule();
  });

  it('should create an instance', () => {
    expect(signinModule).toBeTruthy();
  });
});
