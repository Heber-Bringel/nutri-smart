import { useState, useCallback } from 'react';
import { Paciente } from '../../model/entities/Paciente';
import { Container } from '../../di/container';
import { PatientFormData } from './PatientSchema';

export function usePacientesViewModel() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = useCallback(async (query: string, page: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await Container.listPacientesUseCase.execute({ search: query, page, pageSize });
      setPacientes(result.data);
      setTotal(result.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar pacientes.');
      setPacientes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaciente = useCallback(async (id: string): Promise<Paciente | null> => {
    setLoading(true);
    setError(null);
    try {
      const paciente = await Container.getPacienteUseCase.execute(id);
      return paciente;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar paciente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaciente = useCallback(async (data: PatientFormData): Promise<{ senhaTemporaria: string | null; erroConvite: string | null }> => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await Container.createPacienteUseCase.execute({
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        dataNascimento: data.dataNascimento,
        sexoBiologico: data.sexoBiologico,
        pesoInicial: data.pesoInicial,
        altura: data.altura,
        nivelAtividadeFisica: data.nivelAtividadeFisica,
      });
      return { senhaTemporaria: resultado.senhaTemporaria, erroConvite: resultado.erroConvite };
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaciente = useCallback(async (id: string, data: PatientFormData) => {
    setLoading(true);
    setError(null);
    try {
      await Container.updatePacienteUseCase.execute(id, {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        dataNascimento: data.dataNascimento,
        sexoBiologico: data.sexoBiologico,
        pesoInicial: data.pesoInicial,
        altura: data.altura,
        nivelAtividadeFisica: data.nivelAtividadeFisica,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    pacientes,
    total,
    loading,
    error,
    fetchPacientes,
    getPaciente,
    createPaciente,
    updatePaciente,
    clearError,
  };
}
