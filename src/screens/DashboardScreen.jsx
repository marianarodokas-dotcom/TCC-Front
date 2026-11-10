import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../components/Header';
import { COLORS, ROLE_LABELS } from '../constants/theme';
import { getCurrentProfile, signOut } from '../services/auth';
import { getMyAlerts } from '../services/fireGuard';

export function DashboardScreen({ navigation, route }) {
  const [profile, setProfile] = useState(route.params?.profile || null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(!profile);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = profile || await getCurrentProfile();
        if (!current) {
          navigation.replace('Login');
          return;
        }
        if (mounted) setProfile(current);
        const data = await getMyAlerts(current.id_usuario);
        if (mounted) setAlerts(data);
      } catch (error) {
        if (mounted) Alert.alert('Erro', error.message || 'Não foi possível carregar o painel.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const logout = async () => {
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível sair.');
    }
  };

  if (loading || !profile) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.green} /></View>;
  }

  const role = profile.perfil;
  const unread = alerts.filter((item) => !item.visualizado).length;

  return (
    <View style={styles.container}>
      <Header onLogout={logout} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcome}>
          <Text style={styles.kicker}>FIRE GUARD</Text>
          <Text style={styles.name}>{profile.nome || profile.email}</Text>
          <Text style={styles.role}>{ROLE_LABELS[role] || role}</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{role === 'CENTRAL' ? 'CENTRAL DE OPERAÇÕES' : 'PAINEL DE OCORRÊNCIAS'}</Text>
          <Text style={styles.heroText}>
            {role === 'CENTRAL'
              ? 'Analise as detecções e encaminhe ocorrências confirmadas para uma equipe.'
              : role === 'BRIGADISTA'
                ? 'Acompanhe as ocorrências atribuídas à sua equipe e atualize o atendimento.'
                : role === 'FUNCIONARIO'
                  ? 'Visualize os alertas destinados ao seu perfil.'
                  : 'Acompanhe o ambiente da sua empresa e os alertas recebidos.'}
          </Text>
        </View>

        {role === 'ADMIN' ? (
          <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('RegisterType')}>
            <View><Text style={styles.adminButtonTitle}>CADASTRAR USUÁRIO</Text><Text style={styles.adminButtonSub}>Criar perfil pela função protegida do Supabase</Text></View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('ListaAlertas', { profile })}>
          <View><Text style={styles.mainButtonTitle}>ALERTAS</Text><Text style={styles.mainButtonSub}>{unread} não visualizado(s)</Text></View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <InfoCard label="PERFIL" value={ROLE_LABELS[role] || role} />
          <InfoCard label="EMPRESA" value={profile.id_empresa ? 'VINCULADA' : 'NÃO INFORMADA'} />
        </View>

        <Text style={styles.sectionTitle}>FLUXO DO SISTEMA</Text>
        <View style={styles.flowCard}>
          <Text style={styles.flow}>DETECTADA → EM ANÁLISE → ATRIBUÍDA</Text>
          <Text style={styles.flow}>→ ACEITA → A CAMINHO → ATENDIDA → ENCERRADA</Text>
          <Text style={styles.flowAlt}>Ou: FALSA DETECÇÃO</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({ label, value }) {
  return <View style={styles.infoCard}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  loading: { flex: 1, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40, maxWidth: 520, width: '100%', alignSelf: 'center' },
  welcome: { alignItems: 'center', marginBottom: 18 },
  kicker: { color: COLORS.green, fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  name: { color: COLORS.text, fontSize: 22, fontWeight: '900', marginTop: 5, textAlign: 'center' },
  role: { color: COLORS.terracottaDark, fontWeight: '900', marginTop: 3 },
  hero: { backgroundColor: COLORS.green, padding: 20, marginBottom: 14 },
  heroTitle: { color: COLORS.cream, fontWeight: '900', fontSize: 16, letterSpacing: .5, marginBottom: 8 },
  heroText: { color: COLORS.white, lineHeight: 19, fontSize: 13 },
  adminButton: { backgroundColor: COLORS.greenDark, padding: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  adminButtonTitle: { color: COLORS.cream, fontWeight: '900', fontSize: 14 },
  adminButtonSub: { color: COLORS.white, fontSize: 10, marginTop: 3 },
  mainButton: { backgroundColor: COLORS.terracotta, padding: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  mainButtonTitle: { fontWeight: '900', fontSize: 15 },
  mainButtonSub: { fontSize: 11, marginTop: 3 },
  arrow: { fontSize: 30, fontWeight: '300' },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoCard: { flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  infoLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '800' },
  infoValue: { fontSize: 13, color: COLORS.text, fontWeight: '900', marginTop: 5 },
  sectionTitle: { color: COLORS.green, fontWeight: '900', fontSize: 13, marginBottom: 8 },
  flowCard: { backgroundColor: COLORS.white, borderLeftWidth: 5, borderLeftColor: COLORS.green, padding: 14 },
  flow: { color: COLORS.text, fontSize: 11, fontWeight: '800', lineHeight: 19 },
  flowAlt: { color: COLORS.red, fontSize: 11, fontWeight: '900', marginTop: 7 },
});

export default DashboardScreen;
