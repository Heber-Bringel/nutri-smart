## ADDED Requirements

### Requirement: Gráficos de Evolução do Nutricionista
O sistema SHALL exibir gráficos interativos para acompanhamento do histórico de peso, medidas corporais e percentual de adesão diária, acessíveis através da ficha do paciente no perfil do nutricionista.

#### Scenario: Visualização do gráfico de evolução e adesão pelo nutricionista
- **GIVEN** que o usuário está autenticado como nutricionista e está na ficha de um paciente de sua propriedade (restrito por RLS: leitura permitida apenas quando `auth.uid() = nutricionista_id`)
- **WHEN** o nutricionista acessa a aba de evolução
- **THEN** o sistema exibe os gráficos plotando peso, medidas corporais e percentual de adesão ao plano alimentar ao longo do tempo.

### Requirement: Histórico de Evolução do Paciente
O sistema SHALL exibir um gráfico simples da evolução de peso e adesão ao plano alimentar na área autenticada do próprio paciente. O gráfico deverá exibir um recorte restrito aos últimos 30 dias de dados.

#### Scenario: Visualização do histórico na área do paciente
- **GIVEN** que o usuário está autenticado com o perfil de paciente (restrito por RLS: paciente só enxerga os próprios dados via `auth.uid() = user_id`)
- **WHEN** o paciente acessa a sua tela de dashboard/histórico
- **THEN** o sistema renderiza os gráficos de evolução restritos ao período dos últimos 30 dias.
