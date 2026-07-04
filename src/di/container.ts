import { SupabaseAuthService } from '../infra/auth/SupabaseAuthService';
import { LoginUseCase } from '../usecase/auth/LoginUseCase';
import { RegisterUseCase } from '../usecase/auth/RegisterUseCase';
import { GetCurrentUserUseCase } from '../usecase/auth/GetCurrentUserUseCase';
import { SupabasePacienteService } from '../infra/pacientes/SupabasePacienteService';
import { CreatePacienteUseCase } from '../usecase/pacientes/CreatePacienteUseCase';
import { ListPacientesUseCase } from '../usecase/pacientes/ListPacientesUseCase';
import { GetPacienteUseCase } from '../usecase/pacientes/GetPacienteUseCase';
import { DeletePacienteUseCase } from '../usecase/pacientes/DeletePacienteUseCase';

class Container {
  private static _authService = new SupabaseAuthService();
  private static _pacienteService = new SupabasePacienteService();

  static get authService() {
    return this._authService;
  }

  static get pacienteService() {
    return this._pacienteService;
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

  static get createPacienteUseCase() {
    return new CreatePacienteUseCase(this._pacienteService);
  }

  static get listPacientesUseCase() {
    return new ListPacientesUseCase(this._pacienteService);
  }

  static get getPacienteUseCase() {
    return new GetPacienteUseCase(this._pacienteService);
  }

  static get deletePacienteUseCase() {
    return new DeletePacienteUseCase(this._pacienteService);
  }
}

export { Container };
