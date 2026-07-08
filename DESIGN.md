---
name: NutriSmart
description: Sistema web para gestão de pacientes nutricionistas
colors:
  primary: "#10B981"
  primary-hover: "#059669"
  primary-subtle: "#ECFDF5"
  primary-text: "#065F46"
  neutral-bg: "#FAFAFA"
  neutral-surface: "#FFFFFF"
  neutral-subtle: "#F5F5F5"
  neutral-border: "#E5E5E5"
  ink-primary: "#111827"
  ink-secondary: "#6B7280"
  ink-tertiary: "#9CA3AF"
  danger: "#EF4444"
  danger-subtle: "#FEF2F2"
  danger-border: "#FCA5A5"
  success-subtle: "#ECFDF5"
  success-border: "#6EE7B7"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
    typography: "{typography.label}"
    border: "1px solid {colors.neutral-border}"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.neutral-border}"
  input-focus:
    border: "1px solid {colors.primary}"
  badge-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-inactive:
    backgroundColor: "{colors.neutral-subtle}"
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: NutriSmart

## 1. Overview

**Creative North Star: "A Mesa do Clínico"**

O NutriSmart é a mesa de trabalho do nutricionista: organizada, precisa, cada instrumento no seu lugar. A interface existe para servir os dados e o fluxo de trabalho, não para decorar. Não há ruído visual, cores supérfluas ou elementos decorativos. Cada componente tem uma função clara e uma hierarquia definida.

O sistema se inspira em ferramentas como Linear, Vercel e Raycast — produtos que comunicam precisão técnica através de tipografia limpa, espaçamento generoso, uma única cor de destaque usada com disciplina, e zero decoração gratuita.

Este sistema rejeita explicitamente interfaces coloridas e divertidas, gamificação, gradientes decorativos e sombras exageradas. A confiança vem da clareza, não do estilo.

### Key Characteristics
- **Hierarquia pelo espaço.** O que é importante ocupa mais espaço. Margens e padding definem relacionamento, não linhas ou bordas.
- **Movimento mínimo e determinado.** Transições são rápidas (150–200ms), com easing suave, e respeitam `prefers-reduced-motion`.
- **Dados como interface.** Números (calorias, IMC, medidas) são apresentados em monoespaçada para escaneamento rápido.
- **Uma cor, um propósito.** O verde clínico (#10B981) é usado exclusivamente para ações primárias, indicadores de ativo e destaques. Nunca decorativo.

## 2. Colors

A paleta é intencionalmente restrita: neutros de fundo e superfície, uma tinta para hierarquia de texto, e um verde clínico como única cor de destaque funcional.

### Primary
- **Verde Clínico** (#10B981 / oklch(0.63 0.18 160)): Cor de ação primária. Botões principais, links ativos, indicadores de plano ativo, borda de foco em inputs.
- **Verde Clínico Hover** (#059669 / oklch(0.56 0.16 160)): Estado hover de botões e links primários.
- **Verde Clínico Subtle** (#ECFDF5): Fundo de badges de status ativo, mensagens de sucesso.
- **Verde Clínico Text** (#065F46): Texto dentro de badges ativos e mensagens de sucesso.

### Neutral
- **Page Background** (#FAFAFA): Fundo geral da aplicação. Tom levemente cinza para diferenciar da superfície dos cards.
- **Surface** (#FFFFFF): Cards, painéis, dropdowns, inputs.
- **Subtle** (#F5F5F5): Hover em listas, fundo de inputs em estado disabled.
- **Border** (#E5E5E5): Bordas de cards, inputs, divisores.

### Ink
- **Primary** (#111827): Títulos, dados principais.
- **Secondary** (#6B7280): Labels, metadados, texto de apoio.
- **Tertiary** (#9CA3AF): Placeholders, texto disabled, ícones secundários.

### Feedback
- **Danger** (#EF4444): Erros, ações destrutivas.
- **Danger Subtle** (#FEF2F2): Fundo de mensagens de erro.
- **Danger Border** (#FCA5A5): Borda de mensagens de erro.
- **Success Subtle / Border** (#ECFDF5 / #6EE7B7): Mensagens de sucesso.

## 3. Typography

**Body Font:** Inter (com fallback system-ui, sans-serif)
**Mono Font:** JetBrains Mono (com fallback monospace)

O Inter é carregado via Google Fonts com pesos 400, 500, 600. JetBrains Mono é carregado com peso 400. A combinação comunica modernidade técnica (Inter) com precisão de dados (JetBrains Mono).

### Hierarchy
- **Display** (600, 24px, 1.25): Títulos de página. Usado exclusivamente como heading principal de cada tela.
- **Headline** (600, 20px, 1.3): Subtítulos, títulos de seção dentro de cards.
- **Title** (500, 16px, 1.4): Nomes em listas, títulos de cartão.
- **Body** (400, 14px, 1.5): Texto corrido, parágrafos, labels de formulário.
- **Body Small** (400, 12px, 1.5): Metadados, timestamps, informações secundárias.
- **Label** (500, 11px, 1.4, tracking 0.05em, uppercase): Rótulos de formulário, badges, cabeçalhos de tabela.
- **Mono Data** (400, 13px, 1.4, JetBrains Mono): Valores numéricos (calorias, IMC, peso), horários, datas.

### Named Rules
**A Regra da Monoespaçada.** Todo dado numérico que o nutricionista precisa escanear rapidamente (calorias, medidas, IMC, horários) deve usar JetBrains Mono. Texto descritivo usa Inter. A alternância entre as duas fontes cria um ritmo visual que sinaliza "isso é um dado" vs "isso é uma descrição".

## 4. Elevation

O sistema usa sombras sutis para criar profundidade sem competir com o conteúdo. Sombras são reservadas para elementos que precisam se destacar temporariamente: dropdowns abertos, modais, toasts.

### Shadow Vocabulary
- **Card Shadow** (`0 1px 3px rgba(0,0,0,0.06)`): Sombra de descanso em cards e containers. Discreta, quase imperceptível.
- **Elevated Shadow** (`0 4px 8px rgba(0,0,0,0.08)`): Dropdown aberto, menu, tooltip. Elementos que flutuam sobre a interface.
- **Modal Shadow** (`0 8px 24px rgba(0,0,0,0.12)`): Modal, toast, dialogs.

### Named Rules
**A Regra do Flat por Default.** Superfícies são planas em repouso. Sombras aparecem apenas como resposta a estado (hover, focus, aberto). Cards não têm sombra; apenas bordas finas (#E5E5E5) os definem.

## 5. Components

### Buttons
- **Shape:** Levemente arredondados (6px radius).
- **Primary:** Fundo Verde Clínico (#10B981), texto branco, padding 10px 24px. Label em Label (11px uppercase 500). Hover: Verde Clínico Hover (#059669). Transição 150ms ease-out.
- **Secondary:** Fundo branco, texto ink-primary, borda 1px solid neutral-border. Hover: borda mais escura.
- **Ghost/Text:** Sem fundo nem borda. Texto na cor primária. Hover: fundo subtle (#F5F5F5).
- **Danger:** Fundo danger-subtle (#FEF2F2), texto danger (#EF4444), borda danger-border. Hover: fundo danger sólido com texto branco.

### Cards / Containers
- **Corner Style:** 8px radius.
- **Background:** Surface (#FFFFFF).
- **Border:** 1px solid neutral-border (#E5E5E5). Sem sombra em repouso.
- **Internal Padding:** 24px (32px em cards de formulário).

### Inputs / Fields
- **Style:** Fundo branco, borda 1px solid neutral-border, 6px radius, padding 10px 12px.
- **Focus:** Borda muda para Verde Clínico (#10B981). Transição 150ms ease-out. Sem glow ou box-shadow.
- **Mono Input:** Inputs numéricos (peso, altura, calorias) usam JetBrains Mono.
- **Error:** Borda danger (#EF4444) com fundo danger-subtle.
- **Disabled:** Fundo subtle (#F5F5F5), texto tertiary (#9CA3AF).

### Badges / Tags
- **Ativo:** Fundo Verde Clínico Subtle (#ECFDF5), texto Verde Clínico Text (#065F46), 2px 8px padding, 4px radius.
- **Inativo:** Fundo subtle (#F5F5F5), texto tertiary (#9CA3AF).
- **Calorias:** Fundo Verde Clínico Subtle, texto Verde Clínico Text, monoespaçada, 2px 8px padding, 12px radius (pill).

### Navigation
- **Top Bar:** Altura 48px, fundo branco, borda inferior 1px solid neutral-border.
- **Tabs:** Links sem decoração. Ativo: fonte 500, cor ink-primary, borda inferior 2px solid Verde Clínico. Inativo: fonte 400, cor ink-secondary.
- **Link Ativo:** Verde Clínico (#10B981). Hover: sem mudança de cor.

### Food Item Row
- **Container:** Fundo subtle (#FAFAFA), borda 1px solid #F0F0F0, 6px radius. Cada linha de alimento é um card compacto com padding interno de 10px 14px.
- **Delete Button:** Danger-subtle com texto danger. Hover: fundo danger sólido (#EF4444) com texto branco.

## 6. Do's and Don'ts

### Do:
- **Do** usar Verde Clínico exclusivamente para ações primárias e indicadores de ativo.
- **Do** usar JetBrains Mono para todo dado numérico escaneável (calorias, peso, IMC, medidas).
- **Do** manter padding interno de cards em 24px (32px para formulários).
- **Do** usar sombras apenas para elementos elevados (modais, dropdowns). Cards usam borda, não sombra.
- **Do** usar transições de 150ms com ease-out para todos os estados interativos.
- **Do** respeitar `prefers-reduced-motion` com transições instantâneas.
- **Do** garantir contraste mínimo 4.5:1 para texto corpo (ink-secondary #6B7280 sobre #FAFAFA = 4.5:1 exato).

### Don't:
- **Don't** usar mais de uma cor de destaque. O Verde Clínico é a única cor de ação.
- **Don't** usar sombras com blur acima de 8px em elementos de interface.
- **Don't** usar borda lateral colorida (`border-left`) como decoração em cards ou listas.
- **Don't** usar gradientes em texto (`background-clip: text`).
- **Don't** usar glassmorphism, blur decorativo, ou fundos com repeating-linear-gradient.
- **Don't** usar cores saturadas ou divertidas. O tom é profissional e técnico.
- **Don't** usar `border-radius` acima de 12px em cards ou containers.
- **Don't** usar all-caps em texto corpo. Reserve uppercase para labels curtas (até 4 palavras).
- **Don't** aplicar sombra e borda simultaneamente no mesmo container.
