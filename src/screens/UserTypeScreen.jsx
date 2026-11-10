import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS, ROLE_LABELS } from '../constants/theme';

const LOGO = require('../../assets/images/logoCompleta.png');

export function UserTypeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.wrapper}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
          <View style={styles.banner}><Text style={styles.bannerText}>ENTRAR COMO:</Text></View>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <TouchableOpacity key={value} style={styles.roleButton} onPress={() => navigation.navigate('Login', { expectedRole: value })}>
              <Text style={styles.roleText}>{label}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.note}>O perfil exibido após o login vem do banco de dados.</Text>
          <View style={styles.bottom} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.green },
  scroll: { flexGrow: 1, backgroundColor: COLORS.cream },
  wrapper: { width: '100%', maxWidth: 430, alignSelf: 'center', alignItems: 'center' },
  logo: { width: 210, height: 130, marginVertical: 12 },
  banner: { width: '100%', backgroundColor: COLORS.green, paddingVertical: 13, alignItems: 'center' },
  bannerText: { color: COLORS.cream, fontWeight: '900', letterSpacing: 1.5 },
  roleButton: { width: '84%', backgroundColor: COLORS.terracotta, marginTop: 12, paddingVertical: 13, borderRadius: 4, alignItems: 'center' },
  roleText: { color: COLORS.text, fontWeight: '900', letterSpacing: 1 },
  note: { color: COLORS.muted, fontSize: 11, textAlign: 'center', margin: 18, paddingHorizontal: 20 },
  bottom: { height: 110, width: '100%', backgroundColor: COLORS.green, marginTop: 4 },
});

export default UserTypeScreen;
