import { NivelAtividadeFisica } from '../entities/Paciente';

export function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesDiff = hoje.getMonth() - nascimento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

const FATORES_ATIVIDADE: Record<NivelAtividadeFisica, number> = {
  sedentario: 1.2,
  levemente_ativo: 1.375,
  moderadamente_ativo: 1.55,
  muito_ativo: 1.725,
  extremamente_ativo: 1.9,
};

export function calculateIMC(pesoKg: number, alturaCm: number): number {
  const alturaM = alturaCm / 100;
  return Math.round((pesoKg / (alturaM * alturaM)) * 100) / 100;
}

export function calculateTMB(
  pesoKg: number,
  alturaCm: number,
  idade: number,
  sexo: 'masculino' | 'feminino'
): number {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * idade;
  const tmb = sexo === 'masculino' ? base + 5 : base - 161;
  return Math.round(tmb * 100) / 100;
}

export function calculateGET(tmb: number, nivelAtividade: NivelAtividadeFisica): number {
  const fator = FATORES_ATIVIDADE[nivelAtividade];
  return Math.round(tmb * fator * 100) / 100;
}
