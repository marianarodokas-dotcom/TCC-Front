import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';

export const OpcoesScreen = ({ navigation }) => {
  // Função para redirecionar conforme o perfil selecionado
  const handleSelectPerfil = (perfil) => {
    if (perfil === 'sem_login') {
      navigation.navigate('ListaAlertas'); // Redireciona direto para visualização simples
    } else {
      navigation.navigate('Cadastro', { tipoPerfil: perfil });
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ENTRAR COMO</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => handleSelectPerfil('brigadista')}
          >
            <Text style={styles.buttonText}>BRIGADISTA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => handleSelectPerfil('funcionario')}
          >
            <Text style={styles.buttonText}>FUNCIONÁRIO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => handleSelectPerfil('administrador')}
          >
            <Text style={styles.buttonText}>ADMINISTRADOR</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 35,
    letterSpacing: 1,
  },
  buttonGroup: {
    width: '100%',
    gap: 20, // Espaçamento uniforme entre os botões
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary, // Vinho `#8B2626`
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});