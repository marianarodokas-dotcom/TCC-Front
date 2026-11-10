import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS, STATUS_LABELS } from '../constants/theme';
import { getCurrentProfile } from '../services/auth';
import { getMyAlerts, markAlertRead, subscribeToMyAlerts } from '../services/fireGuard';

const PLACEHOLDER = require('../../assets/images/fireTop.png');

export function ListaAlertasScreen({ navigation, route }) {
  const [profile, setProfile] = useState(route.params?.profile || null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const current = profile || await getCurrentProfile();
      if (!current) { navigation.replace('Login'); return; }
      setProfile(current);
      const data = await getMyAlerts(current.id_usuario);
      setAlerts(data);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar os alertas.');
    }
  }, [profile]);

  useEffect(() => {
    let channel;
    (async () => {
      await load();
      const current = profile || await getCurrentProfile();
      if (current) {
        channel = subscribeToMyAlerts(current.id_usuario, load);
      }
      setLoading(false);
    })();
    return () => { if (channel) channel.unsubscribe?.(); };
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openAlert = async (item) => {
    try {
      if (!item.visualizado) {
        await markAlertRead(item.id_alerta);
        setAlerts((prev) => prev.map((x) => x.id_alerta === item.id_alerta ? { ...x, visualizado: true } : x));
      }
    } catch (_) {}
    navigation.navigate('StatusOcorrencia', { idOcorrencia: item.id_ocorrencia, profile });
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.green} /></View>;

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} />
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id_alerta}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={<>
          <Text style={styles.title}>LOCAIS DE QUEIMA</Text>
          <Text style={styles.subtitle}>Alertas destinados a {profile?.nome || 'você'}</Text>
        </>}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>Nenhum alerta destinado a este usuário.</Text></View>}
        renderItem={({ item, index }) => {
          const occurrence = item.ocorrencia || {};
          const area = occurrence.area || {};
          const isUnread = !item.visualizado;
          return (
            <TouchableOpacity style={[styles.card, isUnread && styles.unread]} onPress={() => openAlert(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.type}>{item.tipo_alerta || 'ALERTA'}</Text>
                {isUnread ? <Text style={styles.new}>NOVO</Text> : null}
              </View>
              <View style={styles.row}>
                <Image source={occurrence.imagem_url ? { uri: occurrence.imagem_url } : PLACEHOLDER} style={styles.thumb} contentFit="cover" />
                <View style={styles.details}>
                  <Text style={styles.local}>Local: {area.nome || area.localizacao || 'Área monitorada'}</Text>
                  <Text style={styles.time}>Horário: {formatDate(occurrence.data_hora || item.data_hora)}</Text>
                  <Text style={styles.status}>Status: {STATUS_LABELS[occurrence.status] || occurrence.status || '—'}</Text>
                  <Text style={styles.risk}>Risco: {occurrence.nivel_risco || '—'}</Text>
                </View>
              </View>
              <Text style={styles.message}>{item.mensagem || 'Toque para visualizar a ocorrência.'}</Text>
              {index === 0 ? <Text style={styles.historyLabel}>OCORRÊNCIA MAIS RECENTE</Text> : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('pt-BR');
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  loading: { flex: 1, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 18, paddingBottom: 35, maxWidth: 520, width: '100%', alignSelf: 'center' },
  title: { color: COLORS.green, fontSize: 17, fontWeight: '900', marginBottom: 3 },
  subtitle: { color: COLORS.muted, fontSize: 11, marginBottom: 15 },
  card: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 10 },
  unread: { borderColor: COLORS.red, borderWidth: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  type: { color: COLORS.red, fontWeight: '900', fontSize: 11 },
  new: { color: COLORS.white, backgroundColor: COLORS.red, paddingHorizontal: 6, paddingVertical: 2, fontSize: 9, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 10 },
  thumb: { width: 88, height: 72, borderRadius: 3 },
  details: { flex: 1 },
  local: { color: COLORS.text, fontWeight: '900', fontSize: 12 },
  time: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  status: { color: COLORS.red, fontSize: 10, fontWeight: '900', marginTop: 4 },
  risk: { color: COLORS.text, fontSize: 10, marginTop: 3 },
  message: { color: COLORS.text, fontSize: 10, marginTop: 9, lineHeight: 15 },
  historyLabel: { color: COLORS.muted, fontSize: 8, fontWeight: '900', marginTop: 8 },
  empty: { backgroundColor: COLORS.white, padding: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  emptyText: { color: COLORS.muted, textAlign: 'center' },
});

export default ListaAlertasScreen;
