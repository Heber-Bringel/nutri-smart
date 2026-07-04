import { IAuthService } from '../../model/services/IAuthService';
import { User } from '../../model/entities/User';

export class GetCurrentUserUseCase {
  constructor(private authService: IAuthService) {}

  async execute(): Promise<User | null> {
    return this.authService.getCurrentUser();
  }
}
