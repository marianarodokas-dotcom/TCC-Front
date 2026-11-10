import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS } from '../constants/theme';

const LOGO = require('../../assets/images/logoCompleta.png');

export default function RegisterTypeScreen({ navigation }) {
  const options = [
    { label: 'BRIGADISTA', route: 'RegisterBrigadista' },
    { label: 'FUNCIONÁRIO', route: 'RegisterFuncionario' },
    { label: 'CENTRAL', route: 'Cadastro', perfil: 'CENTRAL' },
    { label: 'ADMINISTRADOR', route: 'Cadastro', perfil: 'ADMIN' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header onBack={() => navigation.goBack()} />

        <View style={styles.wrapper}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />

          <View style={styles.banner}>
            <Text style={styles.bannerText}>CRIAR COMO:</Text>
          </View>

          {options.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.button}
              onPress={() =>
                navigation.navigate(item.route, {
                  tipoPerfil: item.perfil,
                })
              }
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.info}>
            O provisionamento de credenciais deve ser feito por uma Edge
            Function/serviço protegido, conforme o contrato do banco.
          </Text>

          <View style={styles.bottom} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.green },
  scroll: { flexGrow: 1, backgroundColor: COLORS.cream },
  wrapper: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: { width: 210, height: 130, marginVertical: 12 },
  banner: {
    width: '100%',
    backgroundColor: COLORS.green,
    paddingVertical: 13,
    alignItems: 'center',
  },
  bannerText: {
    color: COLORS.cream,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  button: {
    width: '84%',
    backgroundColor: COLORS.terracotta,
    marginTop: 12,
    paddingVertical: 13,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 1,
  },
  info: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    margin: 18,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  bottom: {
    height: 110,
    width: '100%',
    backgroundColor: COLORS.green,
  },
});