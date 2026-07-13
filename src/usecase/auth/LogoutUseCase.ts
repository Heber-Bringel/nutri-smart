import { IAuthService } from '../../model/services/IAuthService';

export class LogoutUseCase {
  constructor(private authService: IAuthService) {}

  async execute(): Promise<void> {
    return this.authService.logout();
  }
}
