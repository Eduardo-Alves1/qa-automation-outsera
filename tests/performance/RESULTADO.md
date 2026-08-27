# Resultado dos Testes de Performance

## Objetivo

Avaliar o comportamento do endpoint público `GET /booking` da Restful Booker sob concorrência controlada, observando tempo de resposta, throughput, taxa de falhas e estabilidade dos checks.

> A Restful Booker é uma API pública compartilhada. Por esse motivo, a execução demonstrativa foi mantida em carga moderada. O perfil de 500 VUs durante 5 minutos está disponível no script, mas não foi executado contra o serviço público.

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

## Execução 2 — Carga progressiva

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

## Thresholds

Todos os critérios configurados foram atendidos na execução progressiva:

```text
checks > 95%           → 100,00%  ✅
http_req_failed < 5%   → 0,00%    ✅
p95 < 2000 ms          → 394,08ms ✅
p99 < 3000 ms          → 396,91ms ✅
```

## Análise

Ao elevar a concorrência progressivamente até 25 VUs, houve aumento esperado na latência quando comparado ao baseline de 5 VUs, porém sem falhas HTTP e sem quebra das validações funcionais.

O throughput aumentou de aproximadamente `3,88 req/s` para `10,97 req/s`, enquanto o p95 passou de `262,94 ms` para `394,08 ms`. Mesmo com o aumento da concorrência, os percentis permaneceram bem abaixo dos thresholds definidos.

Dentro da carga efetivamente testada, **não foi identificado ponto de saturação ou gargalo crítico**. Essa conclusão é limitada ao pico de 25 VUs utilizado na execução demonstrativa e não deve ser extrapolada para 500 VUs sem uma execução específica em ambiente autorizado.

## Perfil previsto pela avaliação

Para executar a configuração citada na avaliação em um ambiente autorizado:

```bash
K6_PROFILE=constant \
K6_VUS=500 \
K6_DURATION=5m \
k6 run tests/performance/load-test.js
```
