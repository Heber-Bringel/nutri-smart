import { IPacienteService, CreatePacienteData } from '../../model/services/IPacienteService';
import { IInviteService } from '../../model/services/IInviteService';
import { Paciente } from '../../model/entities/Paciente';
import { calcularIdade, calculateIMC, calculateTMB, calculateGET } from '../../model/calculations/nutricionalCalculations';
import { PacienteError } from '../../model/errors/PacienteError';

export class CreatePacienteUseCase {
  constructor(
    private pacienteService: IPacienteService,
    private inviteService: IInviteService
  ) {}

  async execute(data: CreatePacienteData): Promise<Paciente> {
    if (!data.nomeCompleto || !data.email || !data.dataNascimento) {
      throw new PacienteError('Nome, e-mail e data de nascimento são obrigatórios.');
    }

    const idade = calcularIdade(data.dataNascimento);
    const imc = calculateIMC(data.pesoInicial, data.altura);
    const tmb = calculateTMB(data.pesoInicial, data.altura, idade, data.sexoBiologico);
    const get = calculateGET(tmb, data.nivelAtividadeFisica);

    const paciente = await this.pacienteService.create({ ...data, imc, tmb, get });

    await this.inviteService.sendInvite(data.email).catch(() => {
      // Invite não crítico: paciente pode se cadastrar manualmente depois
    });

    return paciente;
  }
}
