import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const allowedProfiles = new Set(['ADMIN', 'CENTRAL', 'FUNCIONARIO', 'BRIGADISTA']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Configuração da função incompleta.');

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Autenticação obrigatória.');
    const token = authHeader.slice('Bearer '.length);
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) throw new Error('Sessão inválida.');

    const { data: requester, error: requesterError } = await admin
      .from('usuario')
      .select('id_usuario,id_empresa,perfil,ativo')
      .eq('id_usuario', authData.user.id)
      .single();

    if (requesterError || !requester || requester.perfil !== 'ADMIN' || !requester.ativo) {
      throw new Error('Somente um ADMIN ativo pode provisionar usuários.');
    }

    const body = await req.json();
    const { nome, email, senha, cpf, perfil, id_empresa } = body;

    if (!nome || !email || !senha || !cpf || !perfil || !id_empresa) {
      throw new Error('nome, email, senha, cpf, perfil e id_empresa são obrigatórios.');
    }
    if (!allowedProfiles.has(perfil)) throw new Error('Perfil inválido.');
    if (id_empresa !== requester.id_empresa) throw new Error('O usuário deve pertencer à empresa do ADMIN.');

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: String(email).trim().toLowerCase(),
      password: String(senha),
      email_confirm: true,
    });

    if (createError || !created.user) throw createError || new Error('Não foi possível criar o usuário.');

    const { data: profile, error: profileError } = await admin
      .from('usuario')
      .insert({
        id_usuario: created.user.id,
        id_empresa,
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        cpf: String(cpf).replace(/\D/g, ''),
        perfil,
        ativo: true,
      })
      .select()
      .single();

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      throw profileError;
    }

    return new Response(JSON.stringify({ ok: true, user: profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Erro interno.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
