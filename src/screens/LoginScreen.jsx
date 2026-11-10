import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS } from '../constants/theme';
import { getCurrentProfile, signIn, signOut } from '../services/auth';

const LOGO_CENTER = require('../../assets/images/logoCompleta.png');

export function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const expectedRole = route.params?.expectedRole;

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email.trim() || !senha) {
      setErrorMessage('Informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, senha);
      const profile = await getCurrentProfile();

      if (!profile) {
        await signOut();
        throw new Error('O login foi aceito pelo Auth, mas não existe um perfil correspondente na tabela usuario.');
      }

      if (!profile.ativo) {
        await signOut();
        throw new Error('Seu perfil está inativo. Procure o administrador da empresa.');
      }

      if (expectedRole && profile.perfil !== expectedRole) {
        await signOut();
        throw new Error(`Este usuário está cadastrado como ${profile.perfil}, não como ${expectedRole}.`);
      }

      navigation.replace('Dashboard', { profile });
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível entrar. Verifique o e-mail e a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header onBack={() => navigation.goBack()} />
          <View style={styles.wrapper}>
            <Image source={LOGO_CENTER} style={styles.logo} contentFit="contain" />
            <View style={styles.card}>
              <Field label="EMAIL" value={email} onChangeText={setEmail} placeholder="Digite seu e-mail" keyboardType="email-address" />
              <Field label="SENHA" value={senha} onChangeText={setSenha} placeholder="Digite sua senha" secureTextEntry />

              {errorMessage ? <View style={styles.errorBox}><Text style={styles.errorText}>{errorMessage}</Text></View> : null}

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.green} /> : <Text style={styles.buttonText}>ENTRAR</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('RegisterType')} style={styles.linkButton}>
                <Text style={styles.linkText}>CRIAR CONTA</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.note}>O acesso é validado pelo Supabase Auth e pelo perfil da tabela usuario.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} style={styles.input} placeholderTextColor="#8B8B8B" autoCapitalize="none" /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.green },
  flex: { flex: 1 },
  content: { flexGrow: 1, backgroundColor: COLORS.cream, paddingBottom: 32 },
  wrapper: { width: '100%', maxWidth: 430, alignSelf: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 210, height: 130, marginVertical: 10 },
  card: { width: '100%', backgroundColor: COLORS.green, borderRadius: 4, padding: 22 },
  field: { marginBottom: 14 },
  label: { color: COLORS.cream, fontWeight: '800', fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: COLORS.white, height: 46, borderRadius: 7, paddingHorizontal: 14, color: COLORS.text },
  errorBox: { backgroundColor: '#FCE8E6', borderWidth: 1, borderColor: COLORS.terracotta, padding: 10, marginBottom: 12, borderRadius: 4 },
  errorText: { color: COLORS.redDark, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  button: { alignSelf: 'center', minWidth: 140, backgroundColor: COLORS.cream, borderRadius: 6, paddingVertical: 11, alignItems: 'center', marginTop: 6 },
  buttonText: { color: COLORS.green, fontWeight: '900', letterSpacing: 1 },
  linkButton: { marginTop: 14, alignItems: 'center' },
  linkText: { color: COLORS.cream, fontSize: 11, fontWeight: '800', textDecorationLine: 'underline' },
  note: { color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 12, paddingHorizontal: 15 },
});
