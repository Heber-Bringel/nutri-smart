## Context

O paciente é cadastrado pelo nutricionista, mas não há fluxo para ele ativar a própria conta. A issue #53, formalizada como RF035/HU-22 na ERS v1.3, exige o envio de um convite de boas-vindas por e-mail após o cadastro. A decisão arquitetural está registrada no **ADR 0006 — Convite de Acesso do Paciente**.

Estado atual e restrições:
- Stack: React 19 + TypeScript, Supabase Free Tier (Postgres + Auth + RLS), Vercel.
- Arquitetura Clean + MVVM: bibliotecas externas acessadas via Adapter (ADR 0002, 0005); domínio isolado do SDK.
- `pacientes.email` é hoje `NULL` (opcional); a spec `auth` já registra o campo.
- O Supabase Auth já gerencia credenciais; o projeto não deve criar mecanismo próprio de senha.

## Goals / Non-Goals

**Goals:**
- Enviar convite de acesso ao e-mail do paciente após o cadastro clínico bem-sucedido (RF035).
- Permitir que o paciente defina a própria senha por link individual, de uso único, válido por 24 horas.
- Garantir que a falha no envio seja não bloqueante e registrada (RNF014).
- Isolar a operação administrativa do Supabase Auth em Edge Function, sem expor `service_role` ao React.
- Manter o domínio desacoplado via `IPatientInvitationService`/`SupabasePatientInvitationAdapter`.

**Non-Goals:**
- Provedor SMTP externo (ex.: Resend) — permanece alternativa futura sem alterar o domínio.
- Senha temporária, aleatória ou derivada de dado pessoal (ex.: data de nascimento) — rejeitado no ADR 0006.
- Notificações por WhatsApp/SMS e demais itens fora do escopo do MVP.
- Reenvio automático de convite (retry) — apenas log da falha nesta versão.

## Decisions

### Decisão 1: Convite via Supabase Auth `inviteUserByEmail`, não senha gerada
Usar o convite nativo do Supabase Auth, que envia link de uso único para o usuário definir a senha. Alternativas consideradas: (a) senha aleatória por e-mail — expõe credencial em texto aberto; (b) senha = data de nascimento — previsível e reutiliza dado pessoal. Ambas rejeitadas no ADR 0006.

### Decisão 2: Operação administrativa em Supabase Edge Function
O convite exige privilégio administrativo (`service_role`), que não pode ir ao cliente. Uma Edge Function autenticada valida se o solicitante é o nutricionista responsável e chama `inviteUserByEmail`. Alternativa considerada: chamar o admin API direto do React — rejeitada por expor a chave e permitir criação indevida de usuários. Alternativa considerada: `signInWithOtp({ shouldCreateUser: true })` client-side (sem Edge Function) — rejeitada porque a autorização "somente o nutricionista dono convida" ficaria só na app, sem barreira no servidor. A função `supabase/functions/invite/index.ts` já existe cobrindo a chamada ao Auth; falta reforçar autorização e registro de estado.

### Decisão 8: Configuração versionada (config-as-code) e template com design system
A configuração do Auth (template do convite, `site_url`, redirects) é declarada em `supabase/config.toml` e aplicada com `supabase config push`, evitando ajuste manual no painel e mantendo tudo versionado. O corpo do e-mail fica em `supabase/templates/invite.html`, escrito com HTML de e-mail (tabelas + CSS inline) seguindo o design system:
- acento emerald `#10B981` (botão) e hover `#059669`; título `#111827`; texto secundário `#6B7280`; borda `#E5E5E5`; fundo `#FAFAFA`; superfície `#FFFFFF`; fonte Inter com fallback `Arial, sans-serif`;
- logo do sistema hospedada em `public/nutrismart-logo.png`, referenciada por URL absoluta (`{{ .SiteURL }}/nutrismart-logo.png`);
- botão "Criar minha senha" apontando para `{{ .ConfirmationURL }}`, com link textual alternativo para clientes que bloqueiam botões.
Alternativa considerada: manter o texto padrão do Supabase — rejeitada por não ter identidade visual. Alternativa considerada: SMTP externo (Resend) com template dedicado — adiada (ADR 0006), fora do MVP.

### Decisão 3: Adapter de domínio `IPatientInvitationService`
O caso de uso de cadastro depende do contrato `IPatientInvitationService` (domínio); `SupabasePatientInvitationAdapter` (infra) invoca a Edge Function. Mantém a regra do ADR 0002/0005: nenhum SDK no domínio. Permite trocar a infraestrutura (ex.: SMTP externo) sem tocar no caso de uso.

### Decisão 4: Disparo não bloqueante após persistência
A solicitação do convite ocorre após o cadastro clínico ser persistido e não participa da mesma transação. O resultado (`enviado`/`falhou`) é registrado em `convites_paciente`; a falha não propaga erro ao nutricionista. Alternativa considerada: transação única cadastro+convite — rejeitada porque indisponibilidade do e-mail bloquearia o cadastro (viola RNF014).

### Decisão 5: Tabela `convites_paciente` sem token nem senha
Persistir apenas estado operacional (`pendente`, `enviado`, `falhou`, `aceito`), e-mail, `mensagem_erro` sanitizada e timestamps. Token e senha permanecem exclusivamente no Supabase Auth. RLS: `SELECT` apenas para o nutricionista responsável (`auth.uid() = nutricionista_id`); inserção/atualização feitas pela Edge Function com `service_role`.

### Decisão 6: Vínculo `usuario_id` após aceitação
`pacientes.usuario_id` é preenchido somente após o paciente definir a senha e a identidade ser confirmada, habilitando a RLS `pacientes_self_select` (`auth.uid() = usuario_id`). E-mail já associado a conta existente é vinculado apenas após validação segura, nunca sobrescrevendo outro vínculo.

### Decisão 7: E-mail obrigatório (migração de schema)
`pacientes.email` passa a `NOT NULL`, normalizado (trim + lowercase). Validação de formato no formulário (React Hook Form + Zod) e no banco. É uma mudança incompatível com dados legados sem e-mail — ver Migration Plan.

## Risks / Trade-offs

- **Limite/entregabilidade do e-mail nativo do Supabase (R4)** → cadastro não bloqueante, estado persistido e erro sanitizado; SMTP externo previsto como evolução sem alterar o domínio.
- **Exposição de credenciais (R5)** → `service_role` restrita à Edge Function; paciente define a própria senha; nenhum token/senha em tabela pública ou log.
- **Migração de dados legados sem e-mail** → aplicar backfill antes de impor `NOT NULL` (ver plano); em ambiente acadêmico a base pode estar vazia/controlada.
- **Vínculo parcial (conta criada, `usuario_id` não preenchido)** → o preenchimento ocorre na aceitação; o estado do convite permite diagnóstico pelo nutricionista.
- **E-mail já usado por outra conta** → vincular só após validação de identidade; não sobrescrever vínculo existente.

## Migration Plan

1. Criar tabela `convites_paciente` e habilitar RLS com policy de `SELECT` por `nutricionista_id`.
2. Backfill: preencher `pacientes.email` de registros existentes sem e-mail (ou remover/tratar em base acadêmica controlada).
3. Aplicar `ALTER TABLE public.pacientes ALTER COLUMN email SET NOT NULL` após o backfill.
4. Reforçar a Edge Function `invite` com validação do nutricionista responsável e registro de estado em `convites_paciente`; publicar com `supabase functions deploy invite`.
5. Declarar em `supabase/config.toml` o `[auth.email.template.invite]` (apontando `supabase/templates/invite.html`), `site_url` e `additional_redirect_urls` para `/definir-senha`; aplicar com `supabase config push`.
6. Implementar `IPatientInvitationService` + `SupabasePatientInvitationAdapter` e integrar ao fluxo de cadastro.
7. Adicionar campo de e-mail obrigatório no formulário e a tela `/definir-senha`.

**Rollback:** reverter `NOT NULL` para `NULL`, desativar a chamada ao adapter no cadastro e despublicar a Edge Function. `convites_paciente` pode permanecer (apenas estado, sem dados sensíveis) ou ser removida via `DROP TABLE`. A config do template pode ser revertida por novo `config push`.

## Open Questions

- A base atual possui pacientes sem e-mail que exijam backfill, ou o `NOT NULL` pode ser aplicado diretamente?
- A validade do link de convite (24h) será confirmada via `config.toml`/painel do Supabase — validar o valor efetivo no ambiente.
- Passos que exigem sessão autenticada do dono do projeto (`supabase login`, `config push`, `functions deploy`, `db push`) serão executados pelo usuário; o agente prepara os arquivos e fornece os comandos.
