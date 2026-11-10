import { supabase } from './supabase';

export async function getMyAlerts(idUsuario) {
  const { data, error } = await supabase
    .from('alerta')
    .select(`
      id_alerta,
      id_destinatario,
      id_ocorrencia,
      tipo_alerta,
      mensagem,
      data_hora,
      visualizado,
      ocorrencia:ocorrencia (
        id_ocorrencia,
        id_empresa,
        id_camera,
        id_area,
        origem,
        data_hora,
        nivel_risco,
        status,
        confianca_ia,
        imagem_url,
        observacao,
        temperatura,
        dados_sensor,
        area:area_monitorada (
          id_area,
          nome,
          descricao,
          localizacao,
          latitude,
          longitude,
          status
        ),
        camera:camera (
          id_camera,
          id_area,
          nome,
          localizacao,
          endereco_stream,
          status
        )
      )
    `)
    .eq('id_destinatario', idUsuario)
    .order('data_hora', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getOccurrence(idOcorrencia) {
  const { data, error } = await supabase
    .from('ocorrencia')
    .select(`
      *,
      camera:camera (
        *,
        area:area_monitorada (*)
      )
    `)
    .eq('id_ocorrencia', idOcorrencia)
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveTeams(idEmpresa) {
  let query = supabase
    .from('equipe_brigadista')
    .select('*')
    .eq('ativa', true)
    .order('nome');

  if (idEmpresa) query = query.eq('id_empresa', idEmpresa);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function analyzeOccurrence(idOcorrencia) {
  const { data, error } = await supabase
    .from('ocorrencia')
    .update({ status: 'EM_ANALISE' })
    .eq('id_ocorrencia', idOcorrencia)
    .eq('status', 'DETECTADA')
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markFalseDetection(idOcorrencia) {
  const { data, error } = await supabase
    .from('ocorrencia')
    .update({ status: 'FALSA_DETECCAO' })
    .eq('id_ocorrencia', idOcorrencia)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignOccurrence({ idOcorrencia, idEquipe, idUsuario }) {
  const { data, error } = await supabase
    .from('ocorrencia_equipe')
    .insert({
      id_ocorrencia: idOcorrencia,
      id_equipe: idEquipe,
      atribuida_por: idUsuario,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOccurrenceStatus(idOcorrencia, status) {
  const { data, error } = await supabase
    .from('ocorrencia')
    .update({ status })
    .eq('id_ocorrencia', idOcorrencia)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAlertRead(idAlerta) {
  const { data, error } = await supabase
    .from('alerta')
    .update({ visualizado: true })
    .eq('id_alerta', idAlerta)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToMyAlerts(idUsuario, callback) {
  return supabase
    .channel(`alertas-${idUsuario}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'alerta',
        filter: `id_destinatario=eq.${idUsuario}`,
      },
      callback
    )
    .subscribe();
}

export async function unsubscribe(channel) {
  if (channel) await supabase.removeChannel(channel);
}
