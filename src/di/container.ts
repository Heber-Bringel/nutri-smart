import { SupabaseAuthService } from '../infra/auth/SupabaseAuthService';
import { SupabaseInviteService } from '../infra/auth/SupabaseInviteService';
import { LoginUseCase } from '../usecase/auth/LoginUseCase';
import { RegisterUseCase } from '../usecase/auth/RegisterUseCase';
import { GetCurrentUserUseCase } from '../usecase/auth/GetCurrentUserUseCase';
import { SupabasePacienteService } from '../infra/pacientes/SupabasePacienteService';
import { CreatePacienteUseCase } from '../usecase/pacientes/CreatePacienteUseCase';
import { ListPacientesUseCase } from '../usecase/pacientes/ListPacientesUseCase';
import { GetPacienteUseCase } from '../usecase/pacientes/GetPacienteUseCase';
import { DeletePacienteUseCase } from '../usecase/pacientes/DeletePacienteUseCase';
import { UpdatePacienteUseCase } from '../usecase/pacientes/UpdatePacienteUseCase';
import { SupabaseMealPlanService } from '../infra/plano-alimentar/SupabaseMealPlanService';
import { SupabaseFoodBaseService } from '../infra/plano-alimentar/SupabaseFoodBaseService';
import { CreateMealPlanUseCase } from '../usecase/plano-alimentar/CreateMealPlanUseCase';
import { UpdateMealPlanUseCase } from '../usecase/plano-alimentar/UpdateMealPlanUseCase';
import { GetMealPlanUseCase } from '../usecase/plano-alimentar/GetMealPlanUseCase';
import { GetEvolutionChartDataUseCase } from '../usecase/plano-alimentar/GetEvolutionChartDataUseCase';
import { SearchFoodBaseUseCase } from '../usecase/plano-alimentar/SearchFoodBaseUseCase';
import { CreateCustomFoodUseCase } from '../usecase/plano-alimentar/CreateCustomFoodUseCase';
import { SupabaseBodyMeasurementService } from '../infra/medidas/SupabaseBodyMeasurementService';
import { RegisterMeasurementUseCase } from '../usecase/medidas/RegisterMeasurementUseCase';
import { ListMeasurementsUseCase } from '../usecase/medidas/ListMeasurementsUseCase';
import { UpdateMeasurementUseCase } from '../usecase/medidas/UpdateMeasurementUseCase';
import { DeleteMeasurementUseCase } from '../usecase/medidas/DeleteMeasurementUseCase';
import { SupabaseClinicalNoteService } from '../infra/anotacoes/SupabaseClinicalNoteService';
import { CreateClinicalNoteUseCase } from '../usecase/anotacoes/CreateClinicalNoteUseCase';
import { ListClinicalNotesUseCase } from '../usecase/anotacoes/ListClinicalNotesUseCase';
import { UpdateClinicalNoteUseCase } from '../usecase/anotacoes/UpdateClinicalNoteUseCase';
import { DeleteClinicalNoteUseCase } from '../usecase/anotacoes/DeleteClinicalNoteUseCase';
import { SupabaseAdesaoService } from '../infra/adesao/SupabaseAdesaoService';
import { MarkMealAsCompletedUseCase } from '../usecase/adesao/MarkMealAsCompletedUseCase';
import { GetDailyProgressUseCase } from '../usecase/adesao/GetDailyProgressUseCase';

class Container {
  private static _authService = new SupabaseAuthService();
  private static _pacienteService = new SupabasePacienteService();
  private static _inviteService = new SupabaseInviteService();
  private static _mealPlanService = new SupabaseMealPlanService();
  private static _foodBaseService = new SupabaseFoodBaseService();
  private static _measurementService = new SupabaseBodyMeasurementService();
  private static _clinicalNoteService = new SupabaseClinicalNoteService();
  private static _adesaoService = new SupabaseAdesaoService();

  static get authService() {
    return this._authService;
  }

  static get pacienteService() {
    return this._pacienteService;
  }

  static get inviteService() {
    return this._inviteService;
  }

  static get mealPlanService() {
    return this._mealPlanService;
  }

  static get foodBaseService() {
    return this._foodBaseService;
  }

  static get measurementService() {
    return this._measurementService;
  }

  static get clinicalNoteService() {
    return this._clinicalNoteService;
  }

  static get adesaoService() {
    return this._adesaoService;
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
    return new CreatePacienteUseCase(this._pacienteService, this._inviteService);
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

  static get updatePacienteUseCase() {
    return new UpdatePacienteUseCase(this._pacienteService);
  }

  static get createMealPlanUseCase() {
    return new CreateMealPlanUseCase(this._mealPlanService);
  }

  static get updateMealPlanUseCase() {
    return new UpdateMealPlanUseCase(this._mealPlanService);
  }

  static get getMealPlanUseCase() {
    return new GetMealPlanUseCase(this._mealPlanService);
  }

  static get getEvolutionChartDataUseCase() {
    return new GetEvolutionChartDataUseCase(this._adesaoService);
  }

  static get searchFoodBaseUseCase() {
    return new SearchFoodBaseUseCase(this._foodBaseService);
  }

  static get createCustomFoodUseCase() {
    return new CreateCustomFoodUseCase(this._foodBaseService);
  }

  static get registerMeasurementUseCase() {
    return new RegisterMeasurementUseCase(this._measurementService);
  }

  static get listMeasurementsUseCase() {
    return new ListMeasurementsUseCase(this._measurementService);
  }

  static get updateMeasurementUseCase() {
    return new UpdateMeasurementUseCase(this._measurementService);
  }

  static get deleteMeasurementUseCase() {
    return new DeleteMeasurementUseCase(this._measurementService);
  }

  static get createClinicalNoteUseCase() {
    return new CreateClinicalNoteUseCase(this._clinicalNoteService);
  }

  static get listClinicalNotesUseCase() {
    return new ListClinicalNotesUseCase(this._clinicalNoteService);
  }

  static get updateClinicalNoteUseCase() {
    return new UpdateClinicalNoteUseCase(this._clinicalNoteService);
  }

  static get deleteClinicalNoteUseCase() {
    return new DeleteClinicalNoteUseCase(this._clinicalNoteService);
  }

  static get markMealAsCompletedUseCase() {
    return new MarkMealAsCompletedUseCase(this._adesaoService);
  }

  static get getDailyProgressUseCase() {
    return new GetDailyProgressUseCase(this._adesaoService);
  }
}

export { Container };
