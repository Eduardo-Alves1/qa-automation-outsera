# Testes de Performance com K6

Esta camada implementa testes de performance configuráveis contra o endpoint público `GET /booking` da **Restful Booker**.

## Estratégia

O projeto possui dois perfis de execução:

- `ramp`: aumenta a concorrência progressivamente e é o perfil padrão para demonstração;
- `constant`: mantém uma quantidade fixa de usuários virtuais durante todo o período e permite reproduzir a configuração citada na avaliação.

Por se tratar de uma API pública compartilhada, as execuções realizadas para a avaliação utilizaram carga controlada. Cargas elevadas devem ser executadas apenas com autorização do responsável pelo ambiente.

## Perfil progressivo — padrão

Sem variáveis adicionais, o script executa:

```text
5 VUs  → mantém 30s
10 VUs → mantém 30s
15 VUs → mantém 30s
20 VUs → mantém 30s
25 VUs → mantém 30s
ramp down → 0 VUs
```

Entre cada nível existe uma transição de 10 segundos e, ao final, um ramp down de 20 segundos.

Executar:

```bash
npm run test:performance
```

ou:

```bash
k6 run tests/performance/load-test.js
```

### Parametrização do perfil progressivo

```bash
K6_PROFILE=ramp \
K6_START_VUS=5 \
K6_STEP_VUS=5 \
K6_MAX_VUS=25 \
K6_HOLD_DURATION=30s \
K6_RAMP_DURATION=10s \
K6_RAMP_DOWN_DURATION=20s \
k6 run tests/performance/load-test.js
```

Variáveis disponíveis:

| Variável | Padrão | Finalidade |
|---|---:|---|
| `K6_START_VUS` | `5` | usuários virtuais iniciais |
| `K6_STEP_VUS` | `5` | incremento entre níveis |
| `K6_MAX_VUS` | `25` | pico do teste progressivo |
| `K6_HOLD_DURATION` | `30s` | tempo mantido em cada nível |
| `K6_RAMP_DURATION` | `10s` | transição entre níveis |
| `K6_RAMP_DOWN_DURATION` | `20s` | descida final para zero VUs |

## Perfil constante — requisito de 500 VUs / 5 minutos

A avaliação cita a configuração de **500 usuários simultâneos durante 5 minutos**. O script possui um perfil específico para esse formato:

```bash
K6_PROFILE=constant \
K6_VUS=500 \
K6_DURATION=5m \
k6 run tests/performance/load-test.js
```

> Essa carga não foi disparada contra a Restful Booker pública. O comando existe para permitir a execução em um ambiente autorizado e controlado.

## Endpoint testado

```text
GET /booking
```

URL padrão:

```text
https://restful-booker.herokuapp.com
```

A URL pode ser alterada por variável de ambiente:

```bash
PERF_BASE_URL=https://exemplo.com k6 run tests/performance/load-test.js
```

## Validações funcionais durante a carga

Cada iteração verifica:

- status HTTP `200`;
- `Content-Type` contendo `application/json`;
- body retornado como uma lista de reservas.

Também é utilizado `sleep(1)` como think time para evitar rajadas artificiais de requisições contra a API pública.

## Thresholds

Os critérios de aprovação/reprovação são:

```text
Taxa de falhas HTTP < 5%
p95 < 2000 ms
p99 < 3000 ms
Checks > 95%
```

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

Para métricas de tendência são exibidos:

```text
avg
min
med
max
p(90)
p(95)
p(99)
```

## Resultado obtido

Os resultados reais e a análise das execuções utilizadas na avaliação estão registrados em:

[`RESULTADO.md`](./RESULTADO.md)

## Relatório HTML

Para gerar o Web Dashboard e exportar um relatório HTML:

```bash
mkdir -p performance-results

K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT=performance-results/k6-report.html \
k6 run \
  --summary-export=performance-results/k6-summary.json \
  tests/performance/load-test.js
```

Os arquivos de `performance-results/` são evidências de execução e não são versionados.

## GitHub Actions

O workflow manual está em:

```text
.github/workflows/performance-tests.yml
```

Em **Actions → Performance Tests → Run workflow**, o avaliador pode selecionar o perfil e ajustar quantidade de VUs, duração e parâmetros do ramp sem alterar o código.
