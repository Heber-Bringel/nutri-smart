import { IClinicalNoteService, CreateClinicalNoteData, UpdateClinicalNoteData } from '../../model/services/IClinicalNoteService';
import { ClinicalNote } from '../../model/entities/ClinicalNote';
import { ClinicalNoteError } from '../../model/errors/ClinicalNoteError';
import { supabase } from '../supabase/client';
import { ClinicalNoteMapper } from './mappers/ClinicalNoteMapper';
import { getTodayLocal } from '../../shared/utils/date';

export class SupabaseClinicalNoteService implements IClinicalNoteService {
  async create(data: CreateClinicalNoteData): Promise<ClinicalNote> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new ClinicalNoteError('Usuário não autenticado.');

    const { data: row, error } = await supabase
      .from('anotacoes_clinicas')
      .insert({
        paciente_id: data.pacienteId,
        nutricionista_id: user.id,
        data_atendimento: data.dataAtendimento ?? getTodayLocal(),
        conteudo: data.conteudo,
      })
      .select()
      .single();

    if (error) throw new ClinicalNoteError(error.message);

    return ClinicalNoteMapper.toDomain(row);
  }

  async findByPatientId(pacienteId: string): Promise<ClinicalNote[]> {
    const { data: rows, error } = await supabase
      .from('anotacoes_clinicas')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('data_atendimento', { ascending: false });

    if (error) throw new ClinicalNoteError(error.message);

    return (rows || []).map(ClinicalNoteMapper.toDomain);
  }

  async update(id: string, data: UpdateClinicalNoteData): Promise<ClinicalNote> {
    const { data: row, error } = await supabase
      .from('anotacoes_clinicas')
      .update({
        data_atendimento: data.dataAtendimento,
        conteudo: data.conteudo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new ClinicalNoteError(error.message);

    return ClinicalNoteMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('anotacoes_clinicas')
      .delete()
      .eq('id', id);

    if (error) throw new ClinicalNoteError('Erro ao excluir anotação.');
  }
}
