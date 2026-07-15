import { IAuthService } from '../../model/services/IAuthService';

export class RequestPasswordResetUseCase {
  constructor(private authService: IAuthService) {}

  async execute(email: string, redirectTo: string): Promise<void> {
    return this.authService.requestPasswordReset(email, redirectTo);
  }
}
