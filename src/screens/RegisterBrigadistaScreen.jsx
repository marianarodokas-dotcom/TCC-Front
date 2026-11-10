import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
SafeAreaView,
ScrollView,
KeyboardAvoidingView,
Platform,
Alert,
ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS } from '../constants/theme';
import { provisionUser } from '../services/provisioning';

const LOGO = require('../../assets/images/logoCompleta.png');

export function RegisterBrigadistaScreen({ navigation }) {
return (
<RegisterForm
   navigation={navigation}
   perfil="BRIGADISTA"
   title="CADASTRO BRIGADISTA"
 />
);
}

function RegisterForm({ navigation, perfil, title }) {
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [cpf, setCpf] = useState('');
const [idEmpresa, setIdEmpresa] = useState('');
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

const submit = async () => {
setErrorMessage('');

if (
  !nome.trim() ||
  !email.trim() ||
  !senha ||
  !cpf.trim() ||
  !idEmpresa.trim()
) {
  Alert.alert(
    'Atenção',
    'Preencha nome, e-mail, senha, CPF e ID da empresa.'
  );
  return;
}

if (senha.length < 6) {
  Alert.alert(
    'Senha inválida',
    'A senha deve ter no mínimo 6 caracteres.'
  );
  return;
}

try {
  setLoading(true);

  await provisionUser({
    nome,
    email: email.trim(),
    senha,
    cpf: cpf.replace(/\D/g, ''),
    perfil,
    idEmpresa: idEmpresa.trim(),
  });

  Alert.alert(
    'Cadastro enviado',
    'O usuário foi provisionado. Agora ele pode entrar com o e-mail e a senha cadastrados.',
    [
      {
        text: 'OK',
        onPress: () => navigation.replace('Login'),
      },
    ]
  );
} catch (error) {
  setErrorMessage(
    error.message ||
      'Verifique a Edge Function de provisionamento e se você está autenticado como ADMIN.'
  );
} finally {
  setLoading(false);
}

};

return (
<SafeAreaView style={styles.safe}>
<KeyboardAvoidingView
style={styles.flex}
behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
<ScrollView
       contentContainerStyle={styles.scroll}
       keyboardShouldPersistTaps="handled"
     >
<Header onBack={() => navigation.goBack()} />

      <View style={styles.wrapper}>
        <Image
          source={LOGO}
          style={styles.logo}
          contentFit="contain"
        />

        <Text style={styles.title}>{title}</Text>

        <View style={styles.card}>
          <Field
            label="NOME"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />

          <Field
            label="E-MAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />

          <Field
            label="SENHA"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite a senha"
            secureTextEntry
          />

          <Text style={styles.passwordHint}>
            A senha deve ter no mínimo 6 caracteres.
          </Text>

          <Field
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            placeholder="Digite o CPF"
            keyboardType="numeric"
          />

          <Field
            label="ID DA EMPRESA"
            value={idEmpresa}
            onChangeText={setIdEmpresa}
            placeholder="UUID da empresa"
          />

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.green} />
            ) : (
              <Text style={styles.buttonText}>ENVIAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          O cadastro usa a Edge Function de provisionamento prevista
          no contrato do banco. A chave administrativa nunca fica
          no aplicativo.
        </Text>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>

);
}

function Field({ label, ...props }) {
return (
<View style={styles.field}>
<Text style={styles.label}>{label}</Text>
<TextInput
{...props}
style={styles.input}
placeholderTextColor="#8B8B8B"
autoCapitalize="none"
/>
</View>
);
}

const styles = StyleSheet.create({
safe: {
flex: 1,
backgroundColor: COLORS.green,
},
flex: {
flex: 1,
},
scroll: {
flexGrow: 1,
backgroundColor: COLORS.cream,
paddingBottom: 30,
},
wrapper: {
width: '100%',
maxWidth: 430,
alignSelf: 'center',
alignItems: 'center',
padding: 18,
},
logo: {
width: 200,
height: 120,
},
title: {
color: COLORS.green,
fontWeight: '900',
fontSize: 16,
marginBottom: 10,
},
card: {
width: '100%',
backgroundColor: COLORS.green,
padding: 20,
},
field: {
marginBottom: 12,
},
label: {
color: COLORS.cream,
fontWeight: '900',
fontSize: 11,
marginBottom: 5,
},
input: {
height: 44,
backgroundColor: COLORS.white,
borderRadius: 6,
paddingHorizontal: 12,
color: COLORS.text,
},
passwordHint: {
color: COLORS.cream,
fontSize: 11,
marginTop: -7,
marginBottom: 12,
},
button: {
backgroundColor: COLORS.cream,
alignSelf: 'center',
minWidth: 120,
paddingVertical: 11,
alignItems: 'center',
marginTop: 6,
},
buttonText: {
color: COLORS.green,
fontWeight: '900',
},
note: {
color: COLORS.muted,
textAlign: 'center',
fontSize: 10,
lineHeight: 15,
marginTop: 12,
paddingHorizontal: 12,
},
errorBox: {
backgroundColor: '#FCE8E6',
borderWidth: 1,
borderColor: COLORS.terracotta,
padding: 10,
marginBottom: 12,
borderRadius: 4,
},
errorText: {
color: COLORS.redDark,
fontSize: 11,
fontWeight: '700',
lineHeight: 16,
},
});

export default RegisterBrigadistaScreen;