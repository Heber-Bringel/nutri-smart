import { IAuthService, RegisterData } from '../../model/services/IAuthService';
import { User } from '../../model/entities/User';

export class RegisterUseCase {
  constructor(private authService: IAuthService) {}

  async execute(data: RegisterData): Promise<User> {
    return this.authService.register(data);
  }
}
