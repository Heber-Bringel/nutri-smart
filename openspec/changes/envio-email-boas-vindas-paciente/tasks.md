## 1. Banco de dados e RLS

- [ ] 1.1 Criar a tabela `public.convites_paciente` (estado operacional, sem token/senha) com `status` CHECK (`pendente`, `enviado`, `falhou`, `aceito`), `mensagem_erro` e timestamps
- [ ] 1.2 Criar índices `idx_convites_paciente` e `idx_convites_status`
- [ ] 1.3 Habilitar RLS e criar policy `convites_nutricionista_select` (`auth.uid() = nutricionista_id`)
- [ ] 1.4 Backfill de `pacientes.email` em registros legados sem e-mail (ou tratar base acadêmica controlada)
- [ ] 1.5 Aplicar `ALTER TABLE public.pacientes ALTER COLUMN email SET NOT NULL` após o backfill

## 2. Edge Function de convite

- [ ] 2.1 Criar Edge Function autenticada que valida se o solicitante é o nutricionista responsável pelo paciente
- [ ] 2.2 Invocar o Supabase Auth para convidar o e-mail (metadados mínimos: nome, papel, paciente), sem expor `service_role` ao cliente
- [ ] 2.3 Registrar/atualizar o estado em `convites_paciente` (`enviado`/`falhou`) com `mensagem_erro` sanitizada
- [ ] 2.4 Rejeitar solicitações de origem inválida sem executar o convite
- [ ] 2.5 (usuário) Publicar a função com `supabase functions deploy invite`

## 3. Configuração versionada do Auth (config-as-code)

- [ ] 3.1 Criar `supabase/config.toml` com `[auth] site_url` e `additional_redirect_urls` incluindo `/definir-senha` (local e Vercel)
- [ ] 3.2 Declarar `[auth.email.template.invite]` (subject + `content_path` → `supabase/templates/invite.html`)
- [ ] 3.3 Criar `supabase/templates/invite.html` seguindo o design system: paleta emerald (`#10B981`/`#059669`), tipografia Inter com fallback, tabelas + CSS inline, logo `{{ .SiteURL }}/nutrismart-logo.png`, botão "Criar minha senha" → `{{ .ConfirmationURL }}` e link textual alternativo
- [ ] 3.4 Confirmar/definir a validade do link de convite em 24 horas
- [ ] 3.5 (usuário) Aplicar a config no projeto remoto com `supabase config push`

## 4. Domínio e caso de uso

- [ ] 4.1 Definir o contrato `IPatientInvitationService` na camada de domínio (`model/services`)
- [ ] 4.2 Acionar a solicitação de convite após a persistência do cadastro, de forma não bloqueante (UC-03)
- [ ] 4.3 Garantir que falha no convite não desfaça o cadastro nem retorne erro ao nutricionista

## 5. Infraestrutura (Adapter)

- [ ] 5.1 Implementar `SupabasePatientInvitationAdapter` invocando a Edge Function
- [ ] 5.2 Registrar o adapter no container de injeção de dependências (`di/`)
- [ ] 5.3 Preencher `pacientes.usuario_id` após a aceitação/confirmação de identidade, sem sobrescrever vínculo existente

## 6. Interface (UI)

- [ ] 6.1 Adicionar campo de e-mail obrigatório e validado no formulário de cadastro de paciente (TELA 03)
- [ ] 6.2 Ajustar o feedback de cadastro para informar que o convite foi solicitado
- [ ] 6.3 Implementar a tela `/definir-senha` (TELA 12) com estados: link válido, processando, sucesso, link expirado/utilizado e erro neutro
- [ ] 6.4 Adicionar a rota `/definir-senha` e o redirecionamento para `/login` após sucesso

## 7. Testes

- [ ] 7.1 Teste do caso de uso: convite solicitado após cadastro bem-sucedido
- [ ] 7.2 Teste do caso de uso: falha de convite mantém o cadastro e não retorna erro
- [ ] 7.3 Teste de validação: cadastro bloqueado sem e-mail válido
- [ ] 7.4 Teste de RLS: apenas o nutricionista responsável lê `convites_paciente`; paciente não acessa
- [ ] 7.5 Teste de fluxo: definição de senha por link válido vincula `usuario_id`; link expirado/utilizado exibe mensagem neutra

## 8. Verificação final

- [ ] 8.1 Rodar `npm run lint` e `npm run build` sem erros
- [ ] 8.2 Rodar `openspec validate envio-email-boas-vindas-paciente --strict`
- [ ] 8.3 Validar critérios de aceitação da HU-22 e do RNF014 (não bloqueante, sem credenciais expostas, link de 24h)
- [ ] 8.4 (usuário) Aplicar a migration no projeto remoto com `supabase db push` (após `supabase login`)
