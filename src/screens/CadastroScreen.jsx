import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
SafeAreaView,
ScrollView,
Alert,
ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS } from '../constants/theme';
import { provisionUser } from '../services/provisioning';

const LOGO = require('../../assets/images/logoCompleta.png');

export function CadastroScreen({ navigation, route }) {
const [perfil, setPerfil] = useState(
  route?.params?.tipoPerfil || 'ADMIN'
);
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [cpf, setCpf] = useState('');
const [idEmpresa, setIdEmpresa] = useState('');
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

const submit = async () => {
setErrorMessage('');

if (!nome || !email || !senha || !cpf || !idEmpresa) {
  Alert.alert('Atenção', 'Preencha todos os campos.');
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
    email,
    senha,
    cpf: cpf.replace(/\D/g, ''),
    perfil,
    idEmpresa,
  });

  Alert.alert(
    'Cadastro enviado',
    'O usuário foi criado pelo serviço de provisionamento.',
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
      'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.'
  );
} finally {
  setLoading(false);
}

};

return (
<SafeAreaView style={styles.safe}>
<ScrollView contentContainerStyle={styles.scroll}>
<Header onBack={() => navigation.goBack()} />

    <View style={styles.wrapper}>
      <Image
        source={LOGO}
        style={styles.logo}
        contentFit="contain"
      />

      <Text style={styles.title}>CADASTRO ADMINISTRATIVO</Text>

      <View style={styles.card}>
        <Text style={styles.label}>PERFIL</Text>

        <View style={styles.roles}>
          {['ADMIN', 'CENTRAL', 'FUNCIONARIO', 'BRIGADISTA'].map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.role,
                  perfil === item && styles.roleSelected,
                ]}
                onPress={() => setPerfil(item)}
              >
                <Text style={styles.roleText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <Field
          label="NOME"
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
        />

        <Field
          label="E-MAIL"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o e-mail"
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
    </View>
  </ScrollView>
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
marginBottom: 10,
},
card: {
width: '100%',
backgroundColor: COLORS.green,
padding: 18,
},
label: {
color: COLORS.cream,
fontWeight: '900',
fontSize: 11,
marginBottom: 6,
},
roles: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 7,
marginBottom: 12,
},
role: {
borderWidth: 1,
borderColor: COLORS.cream,
paddingVertical: 7,
paddingHorizontal: 8,
},
roleSelected: {
backgroundColor: COLORS.terracotta,
},
roleText: {
color: COLORS.cream,
fontSize: 9,
fontWeight: '900',
},
field: {
marginBottom: 11,
},
input: {
backgroundColor: COLORS.white,
height: 43,
borderRadius: 6,
paddingHorizontal: 12,
color: COLORS.text,
},
passwordHint: {
color: COLORS.cream,
fontSize: 11,
marginTop: -6,
marginBottom: 12,
},
button: {
backgroundColor: COLORS.cream,
alignSelf: 'center',
minWidth: 120,
paddingVertical: 11,
alignItems: 'center',
marginTop: 5,
},
buttonText: {
color: COLORS.green,
fontWeight: '900',
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

export default CadastroScreen;
