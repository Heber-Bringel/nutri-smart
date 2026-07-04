import { IAuthService, LoginCredentials } from '../../model/services/IAuthService';
import { User } from '../../model/entities/User';

export class LoginUseCase {
  constructor(private authService: IAuthService) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    return this.authService.login(credentials);
  }
}
