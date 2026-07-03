# Workflow Profissional — NutriSmart (Git + GitHub + OpenSpec)

Este documento aplica o modelo de workflow profissional (Issue → PR → Merge) ao NutriSmart:

---

## 1. Fluxo completo (Issue → Deploy)

O fluxo genérico `Issue → Planejamento → Branch → Dev → Commits → Push → PR → Review → Aprovação → Merge → Deploy` fica assim no NutriSmart

```
Issue (GitHub, referencia RF/HU)
   ↓
/opsx:new <nome-da-change>          ← branch nasce aqui, mesmo nome da issue/change
   ↓
/opsx:continue*                     ← proposal → specs → design → tasks (planejamento formal, vira parte do PR)
   ↓
/opsx:apply                         ← desenvolvimento; cada task virada = candidato a commit
   ↓
Commits padronizados (Conventional Commits)
   ↓
Push
   ↓
/opsx:verify                        ← gate local antes de pedir revisão humana
   ↓
Pull Request (draft, aberto desde o início do planejamento)
   ↓
Code Review
   ↓
Aprovação
   ↓
Merge (Squash)
   ↓
/opsx:archive                       ← mescla specs, arquiva a change
```

A diferença do fluxo genérico: aqui o PR **nasce em draft já no `/opsx:new`**, não só quando o código está pronto — o time revisa o plano (proposal/specs/design) antes de uma linha de código existir.

---

## 2. Branches

Convenção `tipo/nome`, com o `nome` **igual ao nome da change do OpenSpec** — isso elimina qualquer ambiguidade entre o que está em `openspec/changes/` e o que está no Git:

```
feature/auth-supabase
feature/patients-crud
feature/nutritional-assessment
feature/clinical-measurements
feature/scheduling
feature/patient-adherence
feature/reports

bugfix/<descrição-curta>
hotfix/<descrição-curta>
refactor/<descrição-curta>
docs/<descrição-curta>
test/<descrição-curta>
chore/<descrição-curta>
```

`main` sempre contém código funcionando. Usaremos `develop` para validação de funcionalidades e mitigar um erro de código direito na `main` — com uma equipe de 5 e MVP de 12 semanas

---

## 3. Issues

Toda mudança nasce de uma Issue, e toda Issue referencia o RF/HU correspondente da Atividade Prática — nada de Issue genérica tipo "melhorar agenda":

```
#14 — [Épico 6] Agendamento de Consulta (RF029, HU-17)

Descrição
Como nutricionista,
quero agendar uma consulta informando data, horário e duração,
para organizar minha rotina de atendimentos.

Critérios de aceite
- Formulário exige paciente, data, horário de início, duração
- Observações são opcionais
- Sistema rejeita conflito de horário (RF032) com mensagem de erro
- Consulta aparece na agenda imediatamente após salvar

Change OpenSpec correspondente
feature/scheduling
```

Ao abrir a branch: `Resolve #14` no primeiro commit ou na descrição do PR — a Issue fecha automaticamente no merge.

---

## 4. Commits (Conventional Commits, com escopo = domínio)

```
feat(auth): implementa login via Supabase Auth
feat(scheduling): adiciona validação de conflito de horário
fix(patients): corrige filtro da listagem de pacientes
docs(workflow): atualiza fluxo de code review
refactor(nutritional-assessment): extrai cálculo de TMB para use case isolado
test(scheduling): adiciona teste unitário do IAgendamentoValidator
chore: atualiza dependências do Supabase client
```

O escopo entre parênteses é sempre um dos 7 domínios de `openspec/specs/` (`auth`, `patients`, `nutritional-assessment`, `patient-adherence`, `clinical-measurements`, `reports`, `scheduling`) — mantém o commit rastreável até o domínio de spec sem precisar abrir o diff.

---

## 5. Pull Request

Template (`.github/PULL_REQUEST_TEMPLATE.md`):

```markdown
## O que foi feito?
<!-- resumo em 2-3 linhas -->

## Issue relacionada
Closes #

## Change OpenSpec
openspec/changes/<nome-da-change>/

## RF / HU cobertos


## Como testar


## Checklist
- [ ] `openspec validate` sem erros
- [ ] `/opsx:verify` rodado e aprovado
- [ ] Lint e formatter passaram localmente (`npm run lint`)
- [ ] Testes unitários dos use cases novos, com mock dos adapters
- [ ] Se tocou em `patients` ou `clinical-measurements`: teste de RLS incluído
- [ ] Se tocou em `scheduling`: teste de conflito de horário incluído
- [ ] Se usou Supabase/jsPDF/calendário: Adapter nomeado no design.md, sem SDK vazando pro domínio
- [ ] Build local funcionando (`npm run build`)
```

Como não há CI, **todo item do checklist é responsabilidade de quem abre o PR** confirmar localmente antes de pedir review — não existe um bot que vai barrar o merge por você.

---

## 6. Code Review

Além do checklist padrão (código limpo, nomes, organização, performance, responsabilidade única), o review no NutriSmart cobre dois pontos específicos do projeto:

- **RLS**: se a change toca `patients` ou `clinical-measurements`, o dono de `auth`/RLS (papel definido no workflow OpenSpec) revisa antes de aprovar.
- **Arquitetura**: use case novo está em `domain/usecases/`, sem import direto do SDK do Supabase? Adapter implementa a interface certa (`IAuthService`, `ReportGenerator`, `IAgendamentoValidator`)?

Reprovar por "funcionou" não é suficiente — o review confere se o padrão Adapter/Strategy/Observer do PRD foi respeitado, não só se a tela carrega.

---

## 7. Merge Strategy

**Squash and Merge**, sempre. Um PR de change do OpenSpec normalmente acumula vários commits (`proposal`, ajustes de `design`, várias tasks de `apply`) — no squash, isso vira um único commit limpo em `main`:

```
feat(scheduling): implementa agendamento de consultas com validação de conflito (#14)
```

Depois do merge, quem é dono da change roda `/opsx:archive` localmente e sobe o commit da spec mesclada (pode ser no mesmo PR ou num PR pequeno separado — decisão da equipe).

---

## 8. Versionamento

SemVer aplicado de forma leve, já que é MVP acadêmico — não precisa de tag a cada PR, só nos marcos de sprint:

```
v0.1.0 → fim do Sprint 1 (auth + patients)
v0.2.0 → fim do Sprint 2/3 (nutritional-assessment, clinical-measurements, scheduling, patient-adherence)
v0.3.0 → fim do Sprint 4 (reports)
v1.0.0 → entrega final (Sprint 5)
```

Mudança incompatível (ex.: mudança de schema que quebra dado existente) → sobe o MINOR mesmo em MVP, documentada no `design.md` da change.

---

## 9. Organização do repositório

Sem `workflows/` (não há Actions) e sem board de Projects — o resto do padrão profissional se mantém:

```
.github/
├── ISSUE_TEMPLATE/
│   ├── feature.md
│   └── bug.md
└── PULL_REQUEST_TEMPLATE.md

docs/
├── Context/              ← ERS, RVS, Status Report, Atividade Prática, PRD
└── workflow/
    ├── openspec-workflow.md   ← ciclo OPSX, domínios, config.yaml
    └── git-workflow.md        ← este documento

openspec/
supabase/
src/
tests/

README.md
CONTRIBUTING.md           ← aponta pros dois arquivos de docs/workflow/
```

---

## 10. Labels

Sem GitHub Projects, as **labels fazem o papel de organização visual** das Issues na aba padrão do GitHub:

```
tipo:       feature · bug · docs · refactor · test · chore
épico:      epico-0-auth · epico-1-patients · epico-2-nutritional-assessment ·
            epico-3-patient-adherence · epico-4-clinical-measurements ·
            epico-5-reports · epico-6-scheduling
prioridade: alta · media · baixa          ← já vem direto da ERS/HU, não inventar nova escala
sensível:   lgpd                          ← marca Issues que tocam dado de saúde (Art. 11), sinaliza revisão de RLS
```

---

## 11. Milestones

Um Milestone por Sprint acadêmico — reaproveita o cronograma que vocês já têm, sem precisar de ferramenta nova:

```
Sprint 0 — Setup ( Héber )
Sprint 1 — Auth + Core Nutricionista ( Héber )
Sprint 2 — Plano Alimentar + Medidas ( Maria Escura )
Sprint 3 — Área Paciente + Agenda ( Alisson do Grau )
Sprint 4 — Relatórios + Gráficos
Sprint 5 — Polimento e Entrega
```
---

## 12. Papéis

| Pessoa | Épico(s) que é dona | Sprint | RF/HU |
|---|---|---|---|
| **Héber** | Épico 0 — Auth | Sprint 1 | RF000, RF015–019 |
| **Mikaelle** | Épico 1 — Patients | Sprint 1 (paralelo ao Héber) | RF001–003, RF009 |
| **Maria Clara** | Épico 2 — Nutritional-assessment | Sprint 2 | RF004–010 |
| **Alisson** | Épico 4 — Clinical-measurements | Sprint 2 (paralelo à Maria Clara) | RF020–025 |
| **Alisson** | Épico 6 — Scheduling | Sprint 3 | RF029–033 |
| **Mikaelle** | Épico 3 — Patient-adherence | Sprint 3 (paralelo ao Alisson) | RF011–014 |
| **Douglas** | Épico 5 — Reports | Sprint 4 | RF026–028 |
 
---


## 13. Qualidade de código (local, sem CI)

Como não há Actions rodando isso remotamente, tudo roda na máquina de cada dev, via hook de commit:

```
ESLint       → detecta problemas
Prettier     → formatação consistente
```

Isso garante que código quebrado nunca chega a ser *pushado*, mesmo sem pipeline remota conferindo depois.

---

## 14. README

Estrutura mínima esperada (raiz do repo):

```markdown
# NutriSmart

## Tecnologias
React 18, Supabase (Postgres + Auth + RLS), Tailwind CSS, jsPDF

## Como instalar
## Como executar
## Arquitetura
(link pro PRD — Adapter/Strategy/Observer)

## Estrutura de pastas
(link pra seção 9 do docs/workflow/openspec-workflow.md)

## Variáveis de ambiente
.env.example — nunca committar chaves reais do Supabase

## Fluxo de contribuição
Leia docs/workflow/openspec-workflow.md e docs/workflow/git-workflow.md
antes de abrir sua primeira Issue/branch.

## Licença
```

---

## 15. Os 10 pilares aplicados ao NutriSmart

| Pilar genérico | Como fica no NutriSmart |
|---|---|
| Toda mudança nasce de uma Issue | Issue referencia RF/HU + nome da change OpenSpec |
| Branch com nome padronizado | `feature/<nome-da-change>` — igual ao `openspec/changes/` |
| Commits seguem Conventional Commits | Escopo = domínio de spec (`feat(scheduling): ...`) |
| Nada entra em `main` sem PR | PR nasce em draft desde `/opsx:new` |
| PR passa por revisão | Review cobre RLS + arquitetura Adapter/Strategy/Observer |
| Branches protegidas | Configuração de repositório
| Código padronizado por ferramenta | ESLint + Prettier
| Documentação atualizada junto com o código | `docs/workflow/` + `openspec/specs/` são a fonte da verdade |
| Histórico limpo (Squash) | Um commit por change mesclada |