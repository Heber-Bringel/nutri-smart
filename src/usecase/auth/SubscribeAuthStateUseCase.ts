import { IAuthService } from '../../model/services/IAuthService';
import { User } from '../../model/entities/User';

export class SubscribeAuthStateUseCase {
  constructor(private authService: IAuthService) {}

  execute(callback: (user: User | null) => void): () => void {
    return this.authService.onAuthStateChange(callback);
  }
}
