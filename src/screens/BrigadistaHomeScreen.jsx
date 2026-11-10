import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView as SafeAreaContextView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export function BrigadistaHomeScreen({ navigation, route }) {
  // Nome do usuário vindo da navegação ou valor padrão
  const userName = route?.params?.userName || 'XXXXXX';

  // Estados simulando dados dinâmicos vindos do banco de dados
  const [alertasAtivos, setAlertasAtivos] = useState([
    {
      id: '1',
      local: 'Casa dos joão 6-67',
      horario: '16:07',
    }
  ]);

  const [historico, setHistorico] = useState([
    { id: 'h1', local: 'Casa dos joão 6-67', horario: '16:07' },
    { id: 'h2', local: 'Casa dos joão 6-67', horario: '16:07' },
    { id: 'h3', local: 'Casa dos joão 6-67', horario: '16:07' },
    { id: 'h4', local: 'Casa dos joão 6-67', horario: '16:07' },
    { id: 'h5', local: 'Casa dos joão 6-67', horario: '16:07' },
    { id: 'h6', local: 'Casa dos joão 6-67', horario: '16:07' },
  ]);

  const handleLogout = () => {
    if (navigation?.navigate) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. Header Customizado da Tela de Brigadista */}
      <View style={styles.headerOuter}>
        <SafeAreaContextView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            
            {/* Botão Sair */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>SAIR 🚪</Text>
            </TouchableOpacity>

            {/* Título Central */}
            <Text style={styles.headerTitle}>🔥 Nature Foundation 🔥</Text>

            {/* Nome do Usuário */}
            <View style={styles.userInfo}>
              <Text style={styles.userIcon}>🧑‍🚒</Text>
              <Text style={styles.userText}>USUÁRIO: {userName}</Text>
            </View>

          </View>
        </SafeAreaContextView>
        <View style={styles.headerBottomBorder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          
          {/* 2. Card Principal Vinho/Vermelho Escuro */}
          <View style={styles.mainCard}>
            
            {/* --- SEÇÃO: LOCAIS DE QUEIMA --- */}
            <Text style={styles.sectionTitle}>LOCAIS DE QUEIMA:</Text>
            
            <View style={styles.sectionBox}>
              {alertasAtivos.length > 0 ? (
                alertasAtivos.map((alerta) => (
                  <View key={alerta.id} style={styles.alertCardOuter}>
                    <Text style={styles.alertWarningIcon}>⚠️</Text>
                    <View style={styles.alertCardInner}>
                      <Text style={styles.alertLocalText}>Local: {alerta.local}</Text>
                      <Text style={styles.alertHorarioText}>
                        Horário: {alerta.horario} <Text style={styles.subTimeZone}>Horário de Brasília</Text>
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Nenhum foco ativo no momento.</Text>
              )}
            </View>


            {/* --- SEÇÃO: HISTÓRICO --- */}
            <Text style={styles.sectionTitle}>HISTÓRICO:</Text>
            
            <View style={styles.sectionBox}>
              {historico.length > 0 ? (
                historico.map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <Text style={styles.historyLocalText}>Local: {item.local}</Text>
                    <Text style={styles.historyHorarioText}>
                      Horário: {item.horario} <Text style={styles.subTimeZone}>Horário de Brasília</Text>
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Sem histórico registrado.</Text>
              )}
            </View>

          </View>

          {/* Ícone de Chama no Rodapé */}
          <Text style={styles.flameIcon}>🔥</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS?.headerBg || '#053B23',
  },
  
  /* ESTILOS DO HEADER CUSTOMIZADO */
  headerOuter: {
    backgroundColor: COLORS?.headerBg || '#053B23',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  headerSafeArea: {
    backgroundColor: COLORS?.headerBg || '#053B23',
  },
  headerContent: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  logoutButton: {
    padding: 4,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  headerTitle: {
    color: '#D8C191',
    fontSize: 13,
    fontStyle: 'italic',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userIcon: {
    fontSize: 12,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  headerBottomBorder: {
    height: 2,
    backgroundColor: COLORS?.cardBg || '#F5F2E9',
  },

  /* ESTILOS DO CONTEÚDO */
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS?.cardBg || '#F5F2E9',
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#8B0000', // Tom Vinho/Vermelho Escuro fiel ao layout
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'serif',
    textDecorationLine: 'underline',
  },
  sectionBox: {
    backgroundColor: '#DCDCDC', // Fundo cinza suave das caixas de listagem
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 20,
  },
  
  /* ESTILOS DOS ALERTAS (LOCAIS DE QUEIMA) */
  alertCardOuter: {
    backgroundColor: '#EAE3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B55A52',
    padding: 8,
    alignItems: 'center',
  },
  alertWarningIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  alertCardInner: {
    backgroundColor: '#8B0000',
    width: '100%',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  alertLocalText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  alertHorarioText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },

  /* ESTILOS DO HISTÓRICO */
  historyCard: {
    backgroundColor: '#EAE3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C5B390',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  historyLocalText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyHorarioText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  subTimeZone: {
    fontSize: 9,
    fontWeight: 'normal',
    color: '#555555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 13,
    paddingVertical: 10,
  },
  flameIcon: {
    fontSize: 26,
    marginTop: 15,
  },
});

export default BrigadistaHomeScreen;