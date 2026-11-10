# Fire Guard — versão alinhada ao banco

Esta versão mantém a identidade visual do protótipo (verde, creme e terracota) e usa o contrato do banco como fonte de verdade.

## 1. Instalação

```bash
npm install
npx expo start
```

## 2. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_PROVISION_FUNCTION_NAME` (opcional; padrão `provision-user`)

Nunca coloque `service_role` no aplicativo.

## 3. Login

O login usa Supabase Auth. Depois da autenticação, o app busca o perfil em `public.usuario` pelo UUID do usuário autenticado.

Perfis suportados:

- ADMIN
- CENTRAL
- FUNCIONARIO
- BRIGADISTA

## 4. Alertas e ocorrências

- `alerta` é a caixa de entrada individual.
- `ocorrencia` é a ocorrência.
- `area_monitorada` e `camera` completam a localização e origem da imagem.
- Realtime é usado em `alerta`.

## 5. Fluxo da CENTRAL

`DETECTADA -> EM_ANALISE -> ATRIBUIDA`

A CENTRAL pode marcar `FALSA_DETECCAO` ou inserir uma linha em `ocorrencia_equipe`. O banco deve cuidar das automações descritas no contrato.

## 6. Fluxo do BRIGADISTA

`ATRIBUIDA -> ACEITA -> A_CAMINHO -> ATENDIDA -> ENCERRADA`

O app apenas solicita a mudança de status; histórico e demais automações continuam no banco.

## 7. Provisionamento de usuários

O contrato do banco determina que a criação de credenciais com `auth.admin.createUser` seja feita por uma Edge Function/serviço protegido. O projeto inclui `supabase/functions/provision-user/index.ts` como implementação de referência.

A função:

1. valida o JWT do solicitante;
2. exige um ADMIN ativo;
3. limita o usuário à mesma empresa;
4. cria o usuário no Auth usando a chave administrativa apenas no servidor;
5. cria o perfil em `public.usuario`;
6. remove o usuário Auth se a criação do perfil falhar.

Para publicar, use o Supabase CLI/Deployment do seu projeto e configure a função com verificação JWT habilitada.

O primeiro ADMIN deve ser criado pelo procedimento de bootstrap previsto no contrato do banco.
