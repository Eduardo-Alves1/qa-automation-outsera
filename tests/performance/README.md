# Testes de Performance com K6

Esta camada implementa um teste de performance configurável contra a API pública **Restful Booker**.

## Estratégia

Por se tratar de um serviço público de terceiros, a configuração padrão utiliza carga reduzida:

```text
5 VUs durante 30 segundos
```

A quantidade de usuários virtuais e a duração não estão fixadas no código. O avaliador pode alterar os valores pelas variáveis de ambiente `K6_VUS` e `K6_DURATION`.

Exemplo com a configuração padrão:

```bash
k6 run tests/performance/load-test.js
```

Exemplo com valores personalizados:

```bash
K6_VUS=20 K6_DURATION=1m k6 run tests/performance/load-test.js
```

O requisito da avaliação cita 500 usuários simultâneos durante 5 minutos. O script suporta essa parametrização:

```bash
K6_VUS=500 K6_DURATION=5m k6 run tests/performance/load-test.js
```

> A execução de carga elevada contra a API pública deve ser realizada somente com autorização do responsável pelo ambiente. O projeto mantém valores padrão baixos para evitar gerar carga indevida em um serviço de terceiros.

## Endpoint testado

```text
GET /booking
```

URL padrão:

```text
https://restful-booker.herokuapp.com
```

A URL também pode ser alterada:

```bash
PERF_BASE_URL=https://exemplo.com K6_VUS=5 K6_DURATION=30s k6 run tests/performance/load-test.js
```

## Validações

Durante a execução são verificados:

- status HTTP `200`;
- `Content-Type` JSON;
- body retornado como lista de reservas.

## Thresholds

A suíte define os seguintes critérios:

```text
Taxa de falhas HTTP < 5%
p95 < 2000 ms
p99 < 3000 ms
Checks > 95%
```

Os thresholds funcionam como critérios de aprovação/reprovação da execução K6.

## Métricas analisadas

O resumo do K6 apresenta, entre outras:

```text
http_req_duration
http_req_failed
http_reqs
checks
iterations
vus
vus_max
```

Também são exibidos `avg`, `min`, `med`, `max`, `p90`, `p95` e `p99` para métricas de tendência.

## Relatório HTML

Para gerar o Web Dashboard e exportá-lo ao final da execução:

```bash
mkdir -p performance-results

K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT=performance-results/k6-report.html \
k6 run --summary-export=performance-results/k6-summary.json tests/performance/load-test.js
```

Os arquivos em `performance-results/` são evidências de execução e não devem ser versionados.
