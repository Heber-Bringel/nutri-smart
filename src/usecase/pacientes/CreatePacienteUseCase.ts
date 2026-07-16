import { IPacienteService, CreatePacienteData } from '../../model/services/IPacienteService';
import { IInviteService } from '../../model/services/IInviteService';
import { Paciente } from '../../model/entities/Paciente';
import { calcularIdade, calculateIMC, calculateTMB, calculateGET } from '../../model/calculations/nutricionalCalculations';
import { PacienteError } from '../../model/errors/PacienteError';

export interface CriarPacienteResultado {
  paciente: Paciente;
  /** Senha temporária gerada para o paciente. Null se a criação do acesso falhou. */
  senhaTemporaria: string | null;
  /** Mensagem de erro ao criar o acesso, se houver. O cadastro clínico já foi salvo. */
  erroConvite: string | null;
}

export class CreatePacienteUseCase {
  constructor(
    private pacienteService: IPacienteService,
    private inviteService: IInviteService
  ) {}

  async execute(data: CreatePacienteData): Promise<CriarPacienteResultado> {
    if (!data.nomeCompleto || !data.email || !data.dataNascimento) {
      throw new PacienteError('Nome, e-mail e data de nascimento são obrigatórios.');
    }

    const idade = calcularIdade(data.dataNascimento);
    const imc = calculateIMC(data.pesoInicial, data.altura);
    const tmb = calculateTMB(data.pesoInicial, data.altura, idade, data.sexoBiologico);
    const get = calculateGET(tmb, data.nivelAtividadeFisica);

    // Cadastro clínico — deve sempre ter sucesso antes de qualquer outra operação.
    const paciente = await this.pacienteService.create({ ...data, imc, tmb, get });

    // Criação do acesso Auth — não bloqueante: falha não desfaz o cadastro clínico.
    try {
      const senhaTemporaria = await this.inviteService.sendInvite(data.email, data.nomeCompleto);
      return { paciente, senhaTemporaria, erroConvite: null };
    } catch (err: unknown) {
      const erroConvite = err instanceof Error ? err.message : 'Erro ao criar acesso do paciente.';
      return { paciente, senhaTemporaria: null, erroConvite };
    }
  }
}
