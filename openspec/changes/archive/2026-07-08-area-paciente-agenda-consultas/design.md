## Context

A NutriSmart precisa implementar o portal da Área do Paciente (HU-08 a HU-10, HU-20) e a Agenda de Consultas para nutricionistas (HU-17 a HU-19). De acordo com as diretrizes do projeto ([ADR 0002](file:///C:/Users/usuario/OneDrive/IFPI/Mod_III/ENG_SOFTWARE_II/nutri-smart/docs/ADRs/0002-escolha-do-estilo-e-organizacao-de-codigo.md) e [ADR 0005](file:///C:/Users/usuario/OneDrive/IFPI/Mod_III/ENG_SOFTWARE_II/nutri-smart/docs/ADRs/0005-adocao-padroes-projeto.md)), devemos garantir que o domínio permaneça isolado de SDKs externos e que padrões de design GoF sejam aplicados para as regras de negócio de agendamento e efeitos colaterais de agenda.

## Goals / Non-Goals

**Goals:**
- Implementar a visualização e navegação de planos alimentares para pacientes por data com cálculo de calorias e barra de progresso diário de refeições concluídas.
- Criar a funcionalidade de agendamento de consultas com prevenção contra choque de horários (Strategy).
- Prover visualização de calendário diário e semanal responsivo (Adapter para React Big Calendar).
- Permitir edição e cancelamento de consultas disparando eventos desacoplados (Observer).
- Configurar segurança de dados com RLS detalhada no Supabase para consultas e registros de adesão de refeições.

**Non-Goals:**
- Sincronização externa bidirecional com Google Calendar ou Outlook (fora do escopo do MVP, classificada como candidata a v2).
- Envio de alertas de consulta por WhatsApp Business API ou SMS (fora do escopo do MVP, classificada como candidata a v2).

## Decisions

### 1. Modelagem do Banco de Dados e Segurança (RLS)
Criaremos a tabela de `consultas` e configuraremos a tabela de `adesao_refeicoes`.

**Estrutura de `consultas`:**
- `id`: `uuid` (Primary Key)
- `nutricionista_id`: `uuid` (Foreign Key para `profiles.id`)
- `paciente_id`: `uuid` (Foreign Key para `pacientes.id`)
- `data`: `date`
- `horario_inicio`: `time`
- `duracao_minutos`: `integer`
- `horario_fim`: `time`
- `status`: `text` (`'agendada'`, `'realizada'`, `'cancelada'`)
- `observacoes`: `text`
- `created_at`: `timestamptz`
- `updated_at`: `timestamptz`

**Políticas de RLS (consultas):**
* **SELECT:** Permite leitura se o usuário autenticado for o nutricionista dono (`auth.uid() = nutricionista_id`) ou o paciente associado (`auth.uid() = paciente_id`).
* **INSERT / UPDATE / DELETE:** Permite apenas se o usuário autenticado for o nutricionista criador (`auth.uid() = nutricionista_id`).

**Políticas de RLS (adesao_refeicoes):**
* **SELECT / INSERT / UPDATE / DELETE:** Permite escrita e leitura apenas se o registro pertencer ao próprio paciente (`auth.uid() = paciente_id`).

---

### 2. Isolamento de Componente de Calendário (Adapter)
Para renderizar o calendário de consultas de forma responsiva sem acoplar a biblioteca `React Big Calendar` ao domínio:
- Criaremos a interface `ICalendarAdapter` no domínio.
- Criaremos `ReactBigCalendarAdapter` na camada `infra/` que implementa `ICalendarAdapter`. Ela mapeia a lista de `Consulta` do domínio para a estrutura de eventos compatível com a biblioteca externa.

---

### 3. Validação de Choque de Horários (Strategy)
A lógica para impedir que o nutricionista agende consultas sobrepostas será implementada via Strategy:
- Definiremos a interface `IAgendamentoValidator` no domínio.
- Criaremos a classe `EvitarChoqueHorarioValidator` que implementa essa interface. Ela receberá os dados do novo agendamento e consultará os agendamentos existentes no mesmo dia, aplicando regras de intersecção temporal.
- Caso o usuário tente criar uma consulta sobreposta, a estratégia lança uma exceção de domínio (ex: `ChoqueHorarioError`).

---

### 4. Desacoplamento de Efeitos Colaterais da Agenda (Observer)
Toda alteração de agendamento (criação, reagendamento ou cancelamento) deve notificar subsistemas sem acoplar o caso de uso principal.
- Utilizaremos a classe `ConsultaEventEmitter` (que estende ou implementa um Observer padrão).
- O caso de uso de agendamento dispara eventos como `consulta:criada` e `consulta:cancelada`.
- Outros serviços (como registro de auditoria, limpeza de caches ou preparação de notificações locais) assinam estes eventos de forma desacoplada.

## Risks / Trade-offs

- **[Risco] Concorrência de Agendamentos Simultâneos:** Duas consultas salvas ao mesmo tempo para o mesmo profissional podem burlar a validação da aplicação se houver atraso na rede.
  - *Mitigação:* Além do `EvitarChoqueHorarioValidator` na aplicação, configuraremos uma constraint de exclusão ou trigger em nível de banco de dados PostgreSQL usando o operador `&&` de range no Supabase.
- **[Risco] Fusos Horários Divergentes:** Diferenças entre o fuso horário da máquina do paciente/nutricionista e do servidor de banco de dados podem gerar exibição errônea.
  - *Mitigação:* Armazenar os horários estritamente em UTC (`timestamptz`) e formatar a exibição no frontend usando a API local do navegador.
