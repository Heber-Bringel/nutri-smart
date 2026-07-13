import { IAuthService } from '../../model/services/IAuthService';

export class UpdatePasswordUseCase {
  constructor(private authService: IAuthService) {}

  async execute(newPassword: string): Promise<void> {
    return this.authService.updatePassword(newPassword);
  }
}
