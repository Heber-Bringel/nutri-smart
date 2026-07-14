# ADR 0006 — Convite de Acesso do Paciente

**Data:** 14/07/2026  
**Status:** Accepted

## Contexto

Ao cadastrar um paciente, o nutricionista precisa habilitar seu acesso à área autenticada. Foram consideradas senhas aleatórias, senhas derivadas da data de nascimento e envio de credenciais por e-mail. Essas opções expõem segredos em texto aberto, incentivam credenciais previsíveis e transferem ao sistema uma responsabilidade já atendida pelo Supabase Auth.

A issue #53 exige que o convite seja solicitado após o cadastro, contenha boas-vindas e próximos passos e que uma falha no envio não interrompa nem reverta o cadastro clínico.

## Decisão

O NutriSmart adotará convite seguro pelo Supabase Auth:

1. O e-mail passa a ser obrigatório no cadastro clínico do paciente (RF001).
2. O paciente é persistido antes da solicitação do convite.
3. `IPatientInvitationService`, definido no domínio, abstrai o fluxo de convite.
4. `SupabasePatientInvitationAdapter`, na infraestrutura, chama uma Supabase Edge Function autenticada.
5. A Edge Function valida o nutricionista responsável e executa a operação administrativa do Supabase Auth; a `service_role` nunca é exposta ao React.
6. O Supabase Auth envia mensagem de boas-vindas com link individual, de uso único e válido por 24 horas.
7. O paciente define sua própria senha na rota `/definir-senha`.
8. A aplicação registra somente o estado operacional (`pendente`, `enviado`, `falhou`, `aceito`) e mensagem de erro sanitizada. Senhas e tokens não são persistidos em tabelas públicas.
9. Falha de convite não desfaz o cadastro e não é retornada como erro ao nutricionista.
10. O MVP usa o serviço nativo de e-mail do Supabase Auth. SMTP externo, como Resend, poderá ser configurado futuramente sem alteração dos contratos de domínio.

## RLS e dados sensíveis

A tabela de estados de convite é vinculada ao paciente e ao nutricionista. Somente o nutricionista responsável pode consultar seus registros. Inserções e atualizações administrativas ocorrem pela Edge Function. Pacientes não acessam logs ou mensagens técnicas.

O e-mail é dado pessoal e deve ser usado exclusivamente para autenticação e comunicação operacional prevista no produto, observando minimização e finalidade.

## Alternativas rejeitadas

### Senha baseada na data de nascimento

Rejeitada por ser previsível, reutilizar dado pessoal como segredo e facilitar acesso indevido.

### Senha aleatória enviada por e-mail

Rejeitada porque expõe credencial em texto aberto e exige troca obrigatória adicional.

### Chamada administrativa diretamente pelo React

Rejeitada porque exporia a chave `service_role` e permitiria criação indevida de usuários.

### Provedor SMTP externo obrigatório no MVP

Rejeitado para reduzir custo e configuração. Permanece alternativa caso os limites ou a entregabilidade do serviço nativo se mostrem insuficientes.

## Consequências

### Positivas

- O paciente escolhe a própria senha.
- Nenhuma credencial é enviada em texto aberto.
- Operações administrativas permanecem fora do navegador.
- O cadastro clínico não depende da disponibilidade do e-mail.
- O Adapter permite substituir a infraestrutura sem alterar o caso de uso.

### Negativas

- Exige Edge Function e configuração do template de convite.
- O serviço nativo possui limites de taxa e entregabilidade adequados apenas ao volume acadêmico.
- É necessário tratar vínculos parciais, convites expirados e e-mails já associados a contas.

## Rastreabilidade

Implementa **RF001, RF015, RF019, RF035, RNF014 e HU-22**. Complementa os ADRs 0002, 0004 e 0005.
