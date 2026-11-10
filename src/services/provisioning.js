import { supabase } from './supabase';
import { getSession } from './auth';

const FUNCTION_NAME =
  process.env.EXPO_PUBLIC_PROVISION_FUNCTION_NAME || 'provision-user';

// Extrai a mensagem detalhada devolvida pela Edge Function.
async function getFunctionErrorMessage(error) {
  let message = error?.message || 'Não foi possível realizar o cadastro.';

  try {
    const response = error?.context;

    if (response && typeof response.json === 'function') {
      const responseData = await response.clone().json();

      if (responseData?.error) {
        message = responseData.error;
      } else if (responseData?.message) {
        message = responseData.message;
      }
    }
  } catch (parseError) {
    console.log(
      '[Fire Guard] Não foi possível interpretar a resposta da função:',
      parseError
    );
  }

  if (/unauthorized|401|autenticação|sessão inválida/i.test(message)) {
    return 'Sua sessão não está autorizada para criar usuários. Entre novamente com uma conta ADMIN.';
  }

  return message;
}

export async function provisionUser({
  nome,
  email,
  senha,
  cpf,
  perfil,
  idEmpresa,
}) {
  // Verifica se existe uma sessão ativa.
  const session = await getSession();

  if (!session) {
    throw new Error(
      'Você precisa estar logado como ADMIN para criar usuários. Entre novamente e tente.'
    );
  }

  // Prepara os dados antes do envio.
  const dados = {
    nome: String(nome || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    senha: String(senha || ''),
    cpf: String(cpf || '').replace(/\D/g, ''),
    perfil: String(perfil || '').trim().toUpperCase(),
    id_empresa: String(idEmpresa || '').trim(),
  };

  // Verifica os campos obrigatórios.
  if (
    !dados.nome ||
    !dados.email ||
    !dados.senha ||
    !dados.cpf ||
    !dados.perfil ||
    !dados.id_empresa
  ) {
    throw new Error(
      'Preencha todos os campos obrigatórios antes de cadastrar.'
    );
  }

  // Verifica se o perfil é permitido.
  const perfisPermitidos = [
    'ADMIN',
    'CENTRAL',
    'FUNCIONARIO',
    'BRIGADISTA',
  ];

  if (!perfisPermitidos.includes(dados.perfil)) {
    throw new Error('O perfil selecionado é inválido.');
  }

  console.log('[Fire Guard] Enviando cadastro:', {
    nome: dados.nome,
    email: dados.email,
    perfil: dados.perfil,
    id_empresa: dados.id_empresa,
  });

  // Chama a Edge Function.
  const { data, error } = await supabase.functions.invoke(
    FUNCTION_NAME,
    {
      body: dados,
    }
  );

  // Mostra o erro detalhado, caso a função recuse o cadastro.
  if (error) {
    const message = await getFunctionErrorMessage(error);

    console.error('[Fire Guard] Erro no provisionamento:', {
      message,
      perfil: dados.perfil,
      functionName: FUNCTION_NAME,
    });

    throw new Error(message);
  }

  // Verifica possíveis erros devolvidos no corpo da resposta.
  if (data?.error) {
    console.error('[Fire Guard] Erro retornado pela função:', data.error);
    throw new Error(data.error);
  }

  console.log('[Fire Guard] Cadastro realizado com sucesso!');

  return data;
}