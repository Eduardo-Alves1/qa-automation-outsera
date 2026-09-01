# Resultado dos Testes de Performance

## Objetivo

Avaliar o comportamento do endpoint público `GET /booking` da Restful Booker sob concorrência controlada, observando tempo de resposta, throughput, taxa de falhas e estabilidade dos checks.

> A Restful Booker é uma API pública compartilhada. Os resultados abaixo representam execuções específicas realizadas durante a avaliação e não devem ser interpretados, isoladamente, como garantia de capacidade do serviço em produção.

## Execução 1 — Baseline

Configuração:

```text
5 VUs
30 segundos
```

| Métrica | Resultado |
|---|---:|
| Requisições | 120 |
| Throughput | 3,88 req/s |
| Checks | 360 / 360 — 100% |
| Falhas HTTP | 0,00% |
| Tempo médio | 262,03 ms |
| Mediana | 261,02 ms |
| p90 | 262,65 ms |
| p95 | 262,94 ms |
| p99 | 267,20 ms |
| Máximo | 388,74 ms |

## Execução 2 — Carga progressiva até 25 VUs

Configuração:

```text
5 → 10 → 15 → 20 → 25 VUs
30 segundos de sustentação por nível
10 segundos de transição entre níveis
20 segundos de ramp down
aproximadamente 3m30s de execução
```

| Métrica | Resultado |
|---|---:|
| Requisições | 2.318 |
| Throughput | 10,97 req/s |
| Checks | 6.954 / 6.954 — 100% |
| Falhas HTTP | 0,00% |
| Tempo médio | 333,11 ms |
| Mediana | 365,04 ms |
| p90 | 392,37 ms |
| p95 | 394,08 ms |
| p99 | 396,91 ms |
| Máximo | 681,78 ms |

## Execução 3 — Ramp progressivo até 500 VUs

Foi realizada uma nova execução aumentando progressivamente a concorrência até atingir **500 VUs**.

Resumo exibido pelo K6:

```text
1 cenário
500 max VUs
20 stages
aproximadamente 5m55s de execução ativa
6m05s de duração máxima incluindo graceful stop
```

| Métrica | Resultado |
|---|---:|
| Pico de concorrência | 500 VUs |
| Requisições | 76.802 |
| Iterações concluídas | 76.802 |
| Iterações interrompidas | 0 |
| Throughput | ~213,91 req/s |
| Checks | 230.406 / 230.406 — 100% |
| Falhas HTTP | 0,00% |
| Tempo médio | 263,68 ms |
| Mediana | 332,43 ms |
| p90 | 392,25 ms |
| p95 | 394,15 ms |
| p99 | 400,82 ms |
| Máximo | 9,08 s |
| Dados recebidos | ~1,7 GB |
| Dados enviados | ~12 MB |

Cada requisição executou três checks:

```text
status deve ser 200
content-type deve ser JSON
body deve retornar uma lista de reservas
```

Todos os checks foram atendidos durante a execução.

## Thresholds

Os thresholds configurados no script são:

```text
checks > 95%
http_req_failed < 5%
p95 < 2000 ms
p99 < 3000 ms
```

### Resultado — execução até 500 VUs

```text
checks > 95%           → 100,00%   ✅
http_req_failed < 5%   → 0,00%     ✅
p95 < 2000 ms          → 394,15 ms ✅
p99 < 3000 ms          → 400,82 ms ✅
```

Todos os thresholds foram atendidos.

## Análise

Na execução progressiva até 500 VUs, o endpoint processou aproximadamente **76,8 mil requisições**, com throughput próximo de **213,91 req/s**, sem falhas HTTP e com **100% dos checks aprovados**.

Os percentis permaneceram estáveis mesmo com o aumento da concorrência: o `p95` ficou em aproximadamente `394,15 ms` e o `p99` em `400,82 ms`, ambos com ampla margem em relação aos thresholds definidos.

Foi registrado um tempo máximo isolado de aproximadamente `9,08 s`. Como 99% das requisições permaneceram abaixo de aproximadamente `401 ms`, esse valor máximo é tratado como um pico pontual e não como evidência suficiente, por si só, de degradação generalizada.

Dentro do cenário executado, **não foi identificado indício de saturação ou gargalo crítico até o pico de 500 VUs**. Essa conclusão é limitada ao endpoint, ambiente e período desta execução e não deve ser extrapolada para outros fluxos ou para capacidade de produção.

## Comparativo das execuções

| Execução | Pico | Requisições | Falhas HTTP | p95 | p99 |
|---|---:|---:|---:|---:|---:|
| Baseline | 5 VUs | 120 | 0,00% | 262,94 ms | 267,20 ms |
| Ramp inicial | 25 VUs | 2.318 | 0,00% | 394,08 ms | 396,91 ms |
| Ramp ampliado | 500 VUs | 76.802 | 0,00% | 394,15 ms | 400,82 ms |

O comparativo mostra que o aumento de concorrência elevou significativamente o volume e o throughput, enquanto os percentis `p95` e `p99` permaneceram próximos dos valores observados na execução de 25 VUs.

## Perfil constante previsto pela avaliação

O script também permite executar um perfil de carga constante com 500 VUs durante 5 minutos:

```bash
K6_PROFILE=constant \
K6_VUS=500 \
K6_DURATION=5m \
k6 run tests/performance/load-test.js
```

Esse perfil é diferente do **ramp progressivo até 500 VUs** documentado acima: no perfil constante, os 500 VUs são sustentados simultaneamente durante todo o período configurado.
