import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS, STATUS_LABELS } from '../constants/theme';
import { getCurrentProfile } from '../services/auth';
import { assignOccurrence, analyzeOccurrence, getActiveTeams, getOccurrence, markFalseDetection, updateOccurrenceStatus } from '../services/fireGuard';

const DEFAULT_FIRE_IMG = require('../../assets/images/fireTop.png');

export function StatusOcorrenciaScreen({ route, navigation }) {
  const [occurrence, setOccurrence] = useState(route.params?.ocorrencia || null);
  const [profile, setProfile] = useState(route.params?.profile || null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(!occurrence);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const current = profile || await getCurrentProfile();
        setProfile(current);
        const id = route.params?.idOcorrencia || occurrence?.id_ocorrencia;
        if (!id) throw new Error('Ocorrência não informada.');
        const data = await getOccurrence(id);
        setOccurrence(data);
        if (current?.perfil === 'CENTRAL') {
          const dataTeams = await getActiveTeams(current.id_empresa);
          setTeams(dataTeams);
        }
      } catch (error) {
        Alert.alert('Erro', error.message || 'Não foi possível carregar a ocorrência.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canAnalyze = profile?.perfil === 'CENTRAL' && occurrence?.status === 'DETECTADA';
  const canAssign = profile?.perfil === 'CENTRAL' && occurrence?.status === 'EM_ANALISE';
  const brigadistaNext = useMemo(() => ({
    ATRIBUIDA: 'ACEITA',
    ACEITA: 'A_CAMINHO',
    A_CAMINHO: 'ATENDIDA',
    ATENDIDA: 'ENCERRADA',
  }[occurrence?.status]), [occurrence?.status]);

  const run = async (fn, successMessage) => {
    try {
      setActionLoading(true);
      const data = await fn();
      if (data?.id_ocorrencia) setOccurrence((old) => ({ ...old, ...data }));
      Alert.alert('Sucesso', successMessage);
    } catch (error) {
      Alert.alert('Não foi possível concluir', error.message || 'Verifique as permissões e tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAnalyze = () => run(() => analyzeOccurrence(occurrence.id_ocorrencia), 'Ocorrência colocada em análise.');
  const handleFalse = () => run(() => markFalseDetection(occurrence.id_ocorrencia), 'Ocorrência marcada como falsa detecção.');

  const handleAssign = async (team) => {
    if (!profile) return;
    await run(
      () => assignOccurrence({ idOcorrencia: occurrence.id_ocorrencia, idEquipe: team.id_equipe, idUsuario: profile.id_usuario }),
      `Ocorrência atribuída à equipe ${team.nome}.`
    );
  };

  const handleNext = () => run(
    () => updateOccurrenceStatus(occurrence.id_ocorrencia, brigadistaNext),
    `Status atualizado para ${STATUS_LABELS[brigadistaNext]}.`
  );

  if (loading || !occurrence) return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.green} /></View>;

  const camera = occurrence.camera || {};
  const area = camera.area || {};

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>OCORRÊNCIA</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>STATUS ATUAL</Text>
          <Text style={styles.statusValue}>♨ {STATUS_LABELS[occurrence.status] || occurrence.status}</Text>
          <Text style={styles.risk}>NÍVEL DE RISCO: {occurrence.nivel_risco || '—'}</Text>
        </View>

        <View style={styles.timeCard}>
          <Text style={styles.timeText}>◷ {formatTime(occurrence.data_hora)}</Text>
          <Text style={styles.dateText}>▣ {formatDate(occurrence.data_hora)}</Text>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>LOCAL DA OCORRÊNCIA</Text>
          <Text style={styles.locationName}>{area.nome || 'Área monitorada'}</Text>
          <Text style={styles.locationDetail}>{area.localizacao || area.descricao || 'Localização não informada'}</Text>
          {area.latitude != null && area.longitude != null ? <Text style={styles.locationDetail}>{area.latitude}, {area.longitude}</Text> : null}
          <Text style={styles.locationDetail}>Câmera: {camera.nome || camera.id_camera || '—'}</Text>
        </View>

        <View style={styles.cameraCard}>
          <Text style={styles.sectionTitle}>IMAGEM DA CÂMERA</Text>
          <Image source={occurrence.imagem_url ? { uri: occurrence.imagem_url } : DEFAULT_FIRE_IMG} style={styles.cameraImage} contentFit="cover" />
          <Text style={styles.cameraMeta}>{occurrence.origem === 'IA' ? 'DETECÇÃO POR IA' : 'REGISTRO MANUAL'}</Text>
        </View>

        {occurrence.observacao ? <View style={styles.note}><Text style={styles.sectionTitle}>OBSERVAÇÃO</Text><Text style={styles.noteText}>{occurrence.observacao}</Text></View> : null}

        {canAnalyze ? (
          <View style={styles.actionGroup}>
            <Text style={styles.actionTitle}>VALIDAÇÃO DA CENTRAL</Text>
            <TouchableOpacity style={styles.greenButton} onPress={handleAnalyze} disabled={actionLoading}><Text style={styles.buttonText}>CONFIRMAR E COLOCAR EM ANÁLISE</Text></TouchableOpacity>
            <TouchableOpacity style={styles.redButton} onPress={handleFalse} disabled={actionLoading}><Text style={styles.buttonText}>MARCAR COMO FALSA DETECÇÃO</Text></TouchableOpacity>
          </View>
        ) : null}

        {canAssign ? (
          <View style={styles.actionGroup}>
            <Text style={styles.actionTitle}>ATRIBUIR EQUIPE</Text>
            {teams.length === 0 ? <Text style={styles.empty}>Nenhuma equipe ativa encontrada nesta empresa.</Text> : teams.map((team) => (
              <TouchableOpacity key={team.id_equipe} style={styles.teamButton} onPress={() => handleAssign(team)} disabled={actionLoading}>
                <Text style={styles.teamName}>{team.nome}</Text>
                <Text style={styles.teamArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {profile?.perfil === 'BRIGADISTA' && brigadistaNext ? (
          <View style={styles.actionGroup}>
            <Text style={styles.actionTitle}>ATUALIZAÇÃO DO ATENDIMENTO</Text>
            <TouchableOpacity style={styles.redButton} onPress={handleNext} disabled={actionLoading}>
              <Text style={styles.buttonText}>ATUALIZAR PARA {STATUS_LABELS[brigadistaNext]}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {actionLoading ? <ActivityIndicator color={COLORS.green} style={{ marginTop: 12 }} /> : null}
      </ScrollView>
    </View>
  );
}

function formatDate(value) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('pt-BR'); }
function formatTime(value) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  loading: { flex: 1, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 18, paddingBottom: 40, maxWidth: 520, width: '100%', alignSelf: 'center' },
  title: { color: COLORS.green, fontWeight: '900', fontSize: 17, marginBottom: 10 },
  statusCard: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.terracotta, padding: 15, marginBottom: 10 },
  statusLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '900' },
  statusValue: { color: COLORS.red, fontSize: 19, fontWeight: '900', marginTop: 5 },
  risk: { color: COLORS.text, fontSize: 10, fontWeight: '800', marginTop: 6 },
  timeCard: { backgroundColor: COLORS.red, padding: 13, marginBottom: 10 },
  timeText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  dateText: { color: COLORS.white, fontSize: 12, fontWeight: '800', marginTop: 4 },
  locationCard: { backgroundColor: COLORS.white, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  sectionTitle: { color: COLORS.green, fontWeight: '900', fontSize: 10, letterSpacing: .7, marginBottom: 7 },
  locationName: { color: COLORS.text, fontWeight: '900', fontSize: 14 },
  locationDetail: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  cameraCard: { backgroundColor: COLORS.white, padding: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  cameraImage: { width: '100%', height: 210, borderRadius: 2 },
  cameraMeta: { color: COLORS.muted, fontSize: 9, fontWeight: '800', marginTop: 6 },
  note: { backgroundColor: COLORS.white, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  noteText: { color: COLORS.text, fontSize: 12, lineHeight: 17 },
  actionGroup: { marginTop: 5, backgroundColor: COLORS.green, padding: 14 },
  actionTitle: { color: COLORS.cream, fontSize: 12, fontWeight: '900', marginBottom: 10 },
  greenButton: { backgroundColor: COLORS.cream, padding: 13, alignItems: 'center', marginBottom: 8 },
  redButton: { backgroundColor: COLORS.red, padding: 13, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: COLORS.white, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  teamButton: { backgroundColor: COLORS.terracotta, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  teamName: { color: COLORS.text, fontWeight: '900' },
  teamArrow: { fontSize: 22 },
  empty: { color: COLORS.cream, fontSize: 11 },
});

export default StatusOcorrenciaScreen;
