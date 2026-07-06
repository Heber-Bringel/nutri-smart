## 1. Setup

- [ ] 1.1 Adicionar a dependência `jspdf` no `package.json` (para relatórios client-side).
- [ ] 1.2 Adicionar a dependência de uma biblioteca de gráficos compatível com React (ex: `recharts`) no `package.json`.

## 2. Infrastructure (Adapters & Domínio)

- [ ] 2.1 Criar ou atualizar a interface `ReportGenerator` em `model/services/`.
- [ ] 2.2 Criar o `JsPdfReportAdapter` em `infra/` implementando `ReportGenerator`.
- [ ] 2.3 Implementar no `JsPdfReportAdapter` os métodos utilitários para desenhar tabelas, textos de dados clínicos, estrutura de layout, e funções de exportar (download) e imprimir (print).

## 3. Lógica de Domínio e ViewModels

- [ ] 3.1 Implementar `GeneratePatientReportUseCase` que orquestra a injeção do Adapter de relatório e envia os dados (RF026).
- [ ] 3.2 Atualizar/Criar a ViewModel do paciente (`PatientViewModel` ou similar) para computar e formatar arrays de evolução do peso, medidas e taxa de adesão prontos para serem plotados nos gráficos.
- [ ] 3.3 Adicionar lógica de filtragem temporal por janela de dias (30, 60 ou 90 dias) na ViewModel para refletir no relatório.

## 4. UI Components - Nutricionista

- [ ] 4.1 Criar o componente `EvolutionChart` utilizando a biblioteca de gráficos escolhida para exibir linha evolutiva de peso, adesão e circunferências/dobras.
- [ ] 4.2 Implementar a visualização da aba "Evolução" na ficha do paciente exibindo os gráficos ao nutricionista (RF010, RF021).
- [ ] 4.3 Criar a interface de configuração para geração do Relatório PDF (exibindo seletor de "30/60/90 dias" e botão "Gerar Relatório") (RF026, RF028).
- [ ] 4.4 Integrar ação "Baixar" e "Imprimir" interligada com `GeneratePatientReportUseCase` na view (RF027).

## 5. UI Components - Paciente

- [ ] 5.1 Reutilizar ou criar um componente simplificado de gráfico de evolução restrito ao histórico de 30 dias de peso e adesão diária.
- [ ] 5.2 Incorporar o gráfico de evolução no painel principal ou histórico dentro da visão logada do paciente (RF014).
