import { SupabaseAuthService } from '../infra/auth/SupabaseAuthService';
import { LoginUseCase } from '../usecase/auth/LoginUseCase';
import { RegisterUseCase } from '../usecase/auth/RegisterUseCase';
import { GetCurrentUserUseCase } from '../usecase/auth/GetCurrentUserUseCase';

class Container {
  private static _authService = new SupabaseAuthService();

  static get authService() {
    return this._authService;
  }

  static get loginUseCase() {
    return new LoginUseCase(this._authService);
  }

  static get registerUseCase() {
    return new RegisterUseCase(this._authService);
  }

  static get getCurrentUserUseCase() {
    return new GetCurrentUserUseCase(this._authService);
  }
}

export { Container };
