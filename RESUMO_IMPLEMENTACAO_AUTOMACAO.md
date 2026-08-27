# Resumo da Implementação das Automações

Este documento é um resumo curto para explicar como as três frentes da avaliação foram elaboradas: **API, E2E e Performance**.

> A automação Mobile não foi implementada porque é um item opcional da avaliação.

## 1. API — Playwright + TypeScript

### Como eu estruturei

Eu separei a automação de API por responsabilidade:

```text
tests/api/
├── clients/  → chamadas HTTP e endpoints
├── data/     → massas válidas, inválidas e incompletas
├── models/   → contratos TypeScript
└── specs/    → cenários e assertions
```

O padrão principal foi criar **Clients** (`BookingClient` e `AuthClient`) para que os arquivos de teste não precisassem conhecer detalhes de implementação das requisições.

### O que foi validado

Implementei os métodos exigidos:

- `GET`;
- `POST`;
- `PUT`;
- `DELETE`.

Nos fluxos positivos são validados, conforme o contrato de cada operação:

- **status code**;
- **headers**;
- **body**.

Também criei cenários negativos para:

- credenciais inválidas;
- token ausente e inválido;
- campos obrigatórios ausentes;
- body vazio;
- JSON malformado;
- ID inexistente;
- método HTTP não suportado.

### Pontos importantes para explicar

**Massas reutilizáveis:** os dados ficam em `data`, evitando payloads duplicados nos specs.

**Tipagem:** os contratos ficam em `models` e o TypeScript está em modo `strict`.

**Dados dinâmicos:** quando um teste depende de uma reserva, ela é criada no próprio fluxo em vez de depender de um ID fixo.

**Validação do efeito da operação:** após `PUT`, faço `GET` para confirmar persistência; após `DELETE`, faço `GET` e espero `404`.

**Contrato real da API:** a Restful Booker possui comportamentos pouco convencionais, como `DELETE` bem-sucedido retornando `201`. Os testes validam o comportamento observado da API, não uma expectativa teórica.

**Tags:** os testes são classificados por domínio, método, positivo/negativo, smoke e regressão.

**Relatório:** `allure-playwright` envia os resultados para o Allure.

---

## 2. E2E — Cucumber + Playwright

### Como eu estruturei

A automação web segue **BDD + Page Object Pattern**:

```text
tests/e2e/
├── features/ → cenários Gherkin
├── pages/    → locators e ações de página
├── steps/    → implementação dos passos
├── data/     → usuários, produtos e dados de checkout
└── support/  → World e Hooks
```

Os arquivos `.feature` foram escritos em português usando `# language: pt`.

### Page Object Pattern

Criei Page Objects separados:

- `LoginPage`;
- `InventoryPage`;
- `CartPage`;
- `CheckoutPage`;
- `MenuPage`.

A ideia é manter **locators e ações de interface fora dos steps**, diminuindo duplicação e facilitando manutenção caso a tela seja alterada.

### World e Hooks

O `E2EWorld` centraliza o browser, context, page e Page Objects usados durante um cenário.

No `Before`:

- o Chromium é iniciado;
- é criado um novo BrowserContext;
- os Page Objects são instanciados.

No `After`:

- se o cenário falhar, é capturado um **screenshot**;
- a imagem é anexada ao Cucumber/Allure;
- browser e contexto são encerrados.

Cada cenário possui seu próprio contexto, evitando dependência entre testes.

### Cenários implementados

**Login:** válido, inválido, usuário ausente, senha ausente e usuário bloqueado.

**Checkout:** adição ao carrinho, checkout completo, campos obrigatórios ausentes, validação do produto e validação de subtotal + imposto = total.

**Menu:** logout, reset do estado da aplicação e navegação por `All Items`.

O SauceDemo não possui cartão/pagamento real. Por isso, os negativos de checkout foram aplicados aos campos disponíveis na aplicação: nome, sobrenome e CEP.

### Execução local e CI

Localmente o browser pode ficar visível com `slowMo`, facilitando acompanhamento. No GitHub Actions, `CI=true` executa o Chromium em modo headless e sem atraso.

**Relatório:** `allure-cucumberjs` integra os cenários Cucumber ao mesmo relatório Allure utilizado pela API.

---

## 3. Performance — K6

### Objetivo

O teste de performance utiliza:

```text
GET /booking
```

da mesma Restful Booker utilizada na automação de API.

Em cada requisição são feitos checks de:

- HTTP `200`;
- `Content-Type` JSON;
- body como lista de reservas.

Também existe `sleep(1)` como think time para evitar rajadas artificiais contra o serviço público.

### Perfil progressivo

Para analisar o comportamento conforme a concorrência aumenta, foi utilizado `ramping-vus`:

```text
5 → 10 → 15 → 20 → 25 VUs
```

Os valores são parametrizáveis por variáveis de ambiente.

### Perfil constante

O script também possui `constant-vus`, permitindo executar o formato citado na avaliação:

```text
500 VUs durante 5 minutos
```

Exemplo:

```bash
K6_PROFILE=constant K6_VUS=500 K6_DURATION=5m k6 run tests/performance/load-test.js
```

Essa carga não foi disparada contra a API pública; o perfil fica disponível para ambiente autorizado.

### Thresholds e métricas

Foram definidos critérios de aprovação:

```text
Falhas HTTP < 5%
p95 < 2000 ms
p99 < 3000 ms
Checks > 95%
```

As principais métricas analisadas são:

- média, mediana, p90, p95, p99 e máximo;
- `http_req_failed`;
- throughput (`http_reqs`);
- checks;
- VUs e iterações.

Na execução progressiva até 25 VUs foram feitas **2.318 requisições**, com **0% de falhas HTTP**, **100% dos checks aprovados**, p95 de **394,08 ms** e p99 de **396,91 ms**. Não foi identificado gargalo crítico dentro da carga efetivamente testada.

---

## 4. CI/CD e evidências

O GitHub Actions executa automaticamente após commits:

```text
TypeScript validation
        │
        ├── API
        └── E2E
             │
             ▼
       Allure unificado
```

Em Pull Request são executados **smoke tests**; em push para `main`, **regressão**.

API e E2E geram resultados separados e o último job combina os dois em um único relatório Allure publicado como artifact.

Performance possui workflow separado e manual, evitando disparar carga automaticamente contra uma API pública. O workflow pode exportar relatório HTML e resumo JSON.

## Como resumir a solução em uma entrevista

> Eu dividi a solução em três camadas independentes. Na API usei Playwright com Clients, Models, Data e Specs para separar comunicação HTTP, contratos, massas e assertions. No E2E usei Cucumber com Page Object Pattern, World e Hooks para manter os cenários legíveis, reutilizáveis e independentes, incluindo screenshots em falhas. Em performance usei K6 com ramping VUs, thresholds e parametrização para observar degradação conforme a concorrência aumenta. API e E2E são executados no GitHub Actions e consolidados em um único Allure; performance fica em workflow manual para controlar a geração de carga.
