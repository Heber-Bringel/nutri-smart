import { Container } from '../../di/container';
import { ClinicalNote } from '../../model/entities/ClinicalNote';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';
import { MealPlan } from '../../model/entities/MealPlan';
import { EvolutionChartData } from '../../model/services/IAdesaoService';

export type ModuloDadosPaciente = 'plano' | 'medidas' | 'anotacoes' | 'evolucao';

/**
 * Cache em memória restrito ao ciclo de vida de um PatientProfileLayout.
 *
 * Todas as abas de um mesmo paciente compartilham as Promises em andamento:
 * o pré-carregamento começa assim que o perfil é aberto e, ao acessar uma aba,
 * ela reutiliza o resultado já disponível (ou aguarda a mesma requisição), sem
 * iniciar uma nova chamada ao Supabase.
 */
export interface PatientModuleCache {
  carregarPlano: () => Promise<MealPlan | null>;
  carregarMedidas: () => Promise<BodyMeasurement[]>;
  carregarAnotacoes: () => Promise<ClinicalNote[]>;
  carregarEvolucao: () => Promise<EvolutionChartData[]>;
  preCarregar: () => Promise<void>;
  invalidar: (...modulos: ModuloDadosPaciente[]) => void;
  definirPlano: (plano: MealPlan | null) => void;
}

function criarOuReutilizar<T>(
  valorAtual: Promise<T> | undefined,
  carregar: () => Promise<T>,
  definir: (valor: Promise<T> | undefined) => void,
): Promise<T> {
  if (valorAtual) return valorAtual;

  const promessa = carregar().catch((erro: unknown) => {
    // Falhas não ficam em cache para permitir uma nova tentativa ao revisitar a aba.
    definir(undefined);
    throw erro;
  });

  definir(promessa);
  return promessa;
}

export function criarPatientModuleCache(pacienteId: string): PatientModuleCache {
  let plano: Promise<MealPlan | null> | undefined;
  let medidas: Promise<BodyMeasurement[]> | undefined;
  let anotacoes: Promise<ClinicalNote[]> | undefined;
  let evolucao: Promise<EvolutionChartData[]> | undefined;

  const carregarPlano = () => criarOuReutilizar(
    plano,
    () => Container.getMealPlanUseCase.execute(pacienteId),
    valor => { plano = valor; },
  );

  const carregarMedidas = () => criarOuReutilizar(
    medidas,
    () => Container.listMeasurementsUseCase.execute(pacienteId),
    valor => { medidas = valor; },
  );

  const carregarAnotacoes = () => criarOuReutilizar(
    anotacoes,
    () => Container.listClinicalNotesUseCase.execute(pacienteId),
    valor => { anotacoes = valor; },
  );

  const carregarEvolucao = () => criarOuReutilizar(
    evolucao,
    () => Container.getEvolutionChartDataUseCase.execute(pacienteId, 365),
    valor => { evolucao = valor; },
  );

  return {
    carregarPlano,
    carregarMedidas,
    carregarAnotacoes,
    carregarEvolucao,
    async preCarregar() {
      await Promise.allSettled([
        carregarPlano(),
        carregarMedidas(),
        carregarAnotacoes(),
        carregarEvolucao(),
      ]);
    },
    invalidar(...modulos) {
      for (const modulo of modulos) {
        if (modulo === 'plano') plano = undefined;
        if (modulo === 'medidas') medidas = undefined;
        if (modulo === 'anotacoes') anotacoes = undefined;
        if (modulo === 'evolucao') evolucao = undefined;
      }
    },
    definirPlano(planoAtualizado) {
      plano = Promise.resolve(planoAtualizado);
    },
  };
}
