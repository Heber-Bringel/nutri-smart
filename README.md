# 🍏 NutriSmart

> **Plataforma inteligente de gestão de clínicas de nutrição e acompanhamento de pacientes.**
> Desenvolvimento integrado para as disciplinas de **Programação para Internet I** (Professor Jeferson Soares) e **Engenharia de Software II** (Professor Mayllon Veras) do Curso de Tecnologia em Análise e Desenvolvimento de Sistemas — IFPI Campus Piripiri.

🔗 **Aplicação em produção:** [https://nutri-smart-kappa.vercel.app](https://nutri-smart-kappa.vercel.app)

---

## 👥 Integrantes da Equipe
* **Alisson Ramires Sena da Silva**
* **Douglas Leone Cunha Pinheiro**
* **Héber Pinto Bringel Correia**
* **Maria Clara Almeida Martins**
* **Mikaelle Raulino Barroso**

---

## 🛠️ Tecnologias Utilizadas

O NutriSmart utiliza uma stack moderna, robusta e focada em performance e escalabilidade:

* **Frontend:** React 19+ com TypeScript e Vite.
* **Estilização:** Tailwind CSS v4 para uma interface moderna, limpa e totalmente responsiva.
* **BaaS & Persistência:** Supabase (PostgreSQL, Supabase Auth e políticas de RLS).
* **Biblioteca de Calendário:** React Big Calendar para agendamento de consultas.
* **Gráficos:** Recharts para monitoramento da evolução física do paciente.
* **Relatórios:** jsPDF e jsPDF-autotable para geração de relatórios de planos alimentares e avaliações clínicas em PDF no lado do cliente.

---

## ⚙️ Instalação e Execução Local

Siga os passos abaixo para rodar a aplicação localmente em sua máquina.

### Pré-requisitos
* Node.js instalado (versão 18 ou superior recomendada).
* NPM (gerenciador de pacotes padrão do Node).

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/Heber-Bringel/nutri-smart.git
   cd nutri-smart
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```
   Abra o arquivo `.env` e preencha com as credenciais do seu projeto Supabase:
   * `VITE_SUPABASE_URL`: URL do projeto no Supabase.
   * `VITE_SUPABASE_ANON_KEY`: Chave anônima pública de API do Supabase.

4. **Executar em modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

---

## 🏗️ Arquitetura do Sistema

O projeto segue os princípios de **Clean Architecture** combinados com o padrão **MVVM** (Model-View-ViewModel), promovendo total isolamento das regras de negócio em relação às bibliotecas externas:

* **Camada de Domínio (Model & Use Cases):** Contém as entidades principais do sistema e as regras de negócio puras (sem dependências de frameworks ou bibliotecas externas).
* **Camada de Apresentação (View & ViewModel):** Telas e componentes React reagem a estados expostos pela ViewModel, que orquestra a chamada de Use Cases.
* **Camada de Infraestrutura (Infra / Adapters):** Implementa as integrações externas (como a conexão com o Supabase e geração de relatórios). A injeção das dependências é controlada em um container centralizado.

Para entender os padrões e decisões arquiteturais adotados, consulte:
* [ADR 0002 — Escolha do Estilo e Organização de Código](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0002-escolha-do-estilo-e-organizacao-de-codigo.md)
* [ADR 0003 — Definição da Stack Tecnológica do MVP](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0003-definicao-da-stack-tecnologica-do-mvp.md)
* [ADR 0005 — Adoção de Padrões de Projeto (Adapter, Strategy, Observer)](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0005-adocao-padroes-projeto.md)

---

## 📂 Estrutura de Pastas do Código Fonte

A estrutura de diretórios em `src/` está organizada da seguinte forma:

```
src/
├── app/            # Interface gráfica (Telas React, Componentes, Layouts e Estilos)
├── viewmodel/      # Controle de estados de apresentação e lógica da UI (MVVM)
├── usecase/        # Orquestradores de regras de negócio (Casos de Uso)
├── model/          # Entidades fundamentais, contratos de serviços e regras de negócio puras
├── infra/          # Implementações e integrações de serviços externos (Adapters)
├── di/             # Módulo de Injeção de Dependências (Container)
└── shared/         # Utilitários compartilhados no sistema
```

Para mais detalhes sobre os diretórios e o fluxo de alteração, veja o guia de [Estrutura do Projeto](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/workflow/git-workflow.md).

---

## 🔄 Fluxo de Contribuição e Versionamento

O desenvolvimento utiliza o fluxo profissional baseado em Issues e Pull Requests com controle local de qualidade.

* **Branches:** Convenção `tipo/nome-da-change` (Ex: `feature/pacientes-crud`, `bugfix/filtro-agenda`).
* **Commits:** Padrão **Conventional Commits** com escopo voltado aos domínios do sistema (Ex: `feat(auth): login via Supabase`, `fix(patients): corrige filtro de busca`).
* **Documentação Obrigatória de Fluxo:**
  * Consulte o [Git Workflow](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/workflow/git-workflow.md) antes de criar branches ou commitar.

---

## 📄 Licença

Este é um projeto acadêmico de código aberto desenvolvido para fins educacionais.
