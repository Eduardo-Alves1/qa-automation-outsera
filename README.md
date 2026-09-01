# QA Automation Outsera

Projeto desenvolvido para uma avaliação técnica de automação de testes, cobrindo **API**, **E2E**, **CI/CD** e **Performance**.

A solução utiliza **Playwright + TypeScript**, **Cucumber.js**, **K6**, **Allure Report** e **GitHub Actions**. A estrutura foi organizada pensando em manutenção, reutilização, execução em mais de um ambiente e crescimento da suíte.

> A automação **Mobile** não foi implementada por ser um item opcional da avaliação.

## Melhorias aplicadas após a avaliação

Após o feedback técnico recebido, alguns pontos da arquitetura foram refatorados para melhorar **manutenibilidade, escalabilidade e reutilização** da automação.

| Melhoria | O que foi alterado | Benefício |
|---|---|---|
| **1. Configuração multiambiente** | Foi criada uma configuração centralizada para `dev`, `hml` e `qa`, com URLs e credenciais separadas por ambiente. | Permite executar a mesma suíte em ambientes diferentes sem alterar o código dos testes. |
| **2. Factory dinâmica de Booking** | As massas fixas foram substituídas por `createBookingData()`, com geração dinâmica de dados e suporte a `overrides`. | Reduz duplicação e facilita criar variações de payload para diferentes cenários. |
| **3. Specs consolidados por recurso** | Os vários arquivos separados por verbo/cenário foram reorganizados em `auth.spec.ts` e `booking.spec.ts`, usando `test.describe` internamente. | Evita crescimento excessivo de arquivos e melhora a manutenção da suíte. |
| **4. Scenario Outline nos cenários repetitivos** | Validações semelhantes de campos obrigatórios em Login e Checkout passaram a usar `Scenario Outline + Examples`. | Reduz repetição no Gherkin sem diminuir a cobertura. |
| **5. Asserts E2E mais completos** | Os testes passaram a validar URL, estado da página, dados do produto, quantidade, preço, mensagens e resultado final do fluxo. | Aumenta a confiança funcional e evita testes baseados apenas em `toBeVisible()`. |

> **Destaque:** Essas melhorias não alteraram apenas a forma de escrever os testes. Elas foram aplicadas pensando em como a suíte se comportaria em um projeto maior, com mais ambientes, endpoints, massas e cenários, con forme comentário do avaliador.

## Escopo entregue

| Frente | Cobertura |
|---|---|
| API | GET, POST, PUT, DELETE, status, headers, body, positivos e negativos |
| E2E | Login, navegação, carrinho, checkout, negativos e Page Object Pattern |
| Relatórios | Allure para API e E2E, screenshot em falha e artifacts no GitHub Actions |
| CI/CD | Typecheck, smoke em PR e regressão em `main` |
| Performance | K6 com carga progressiva, thresholds e perfil constante parametrizável |
| Mobile | Fora do escopo |

## Tecnologias

| Tecnologia | Versão / uso |
|---|---|
| Node.js | 24.x |
| TypeScript | ^7.0.2 |
| Playwright Test | ^1.62.1 |
| Cucumber.js | ^13.2.1 |
| Allure | ^3.16.0 |
| allure-playwright | ^3.11.0 |
| allure-cucumberjs | ^3.11.0 |
| K6 | CLI externo |
| GitHub Actions | CI/CD |

As versões das dependências Node estão registradas em `package.json` e `package-lock.json`.

## Arquitetura

```text
qa-automation-outsera/
├── .github/
│   └── workflows/
│       ├── api-tests.yml
│       └── performance-tests.yml
│
├── config/
│   └── environments.ts
│
├── tests/
│   ├── api/
│   │   ├── clients/
│   │   │   ├── auth.client.ts
│   │   │   └── booking.client.ts
│   │   ├── data/
│   │   │   ├── auth.data.ts
│   │   │   └── booking.data.ts
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   └── booking.model.ts
│   │   └── specs/
│   │       ├── auth.spec.ts
│   │       └── booking.spec.ts
│   │
│   ├── e2e/
│   │   ├── data/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── steps/
│   │   └── support/
│   │
│   └── performance/
│       ├── load-test.js
│       ├── README.md
│       └── RESULTADO.md
│
├── .env.example
├── casos-de-teste.md
├── cucumber.cjs
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

# Configuração de ambientes

> **Melhoria aplicada:** a configuração deixou de depender de uma única URL fixa e passou a suportar múltiplos ambientes de forma centralizada.

O projeto aceita três ambientes:

```text
dev
hml
qa
```

A seleção é feita por:

```env
TEST_ENV=dev
```

As configurações são centralizadas em `config/environments.ts`. Cada ambiente possui URL e credenciais próprias para API e E2E.

Neste desafio os três ambientes podem apontar para as mesmas aplicações públicas; a separação existe para demonstrar como a estrutura se comportaria quando DEV, HML e QA possuíssem endpoints ou usuários diferentes.

Exemplo de variáveis:

```env
TEST_ENV=dev

DEV_API_URL=https://restful-booker.herokuapp.com
DEV_API_USERNAME=admin
DEV_API_PASSWORD=password123
DEV_E2E_URL=https://www.saucedemo.com
DEV_E2E_STANDARD_USERNAME=standard_user
DEV_E2E_STANDARD_PASSWORD=secret_sauce
```

O `.env.example` contém o mapeamento completo de `dev`, `hml` e `qa`.

Para trocar o ambiente em Linux/WSL:

```bash
TEST_ENV=hml npm run test:api
TEST_ENV=qa npm run test:e2e
```

No GitHub Actions, a execução manual também permite selecionar o ambiente.

# Instalação

Pré-requisitos:

- Node.js 20 ou superior, recomendado 24.x;
- npm;
- Git;
- K6 para a suíte de performance.

Clone o projeto e instale as dependências:

```bash
git clone git@github.com:Eduardo-Alves1/qa-automation-outsera.git
cd qa-automation-outsera
npm install
```

Crie o arquivo local de configuração:

```bash
cp .env.example .env
```

Instale o Chromium usado pelo E2E:

```bash
npx playwright install --with-deps chromium
```

Valide a tipagem:

```bash
npx tsc --noEmit
```

# API - Playwright + TypeScript

A automação usa a Restful Booker.

## Organização

A suíte foi separada por responsabilidade:

| Camada | Responsabilidade |
|---|---|
| `clients` | chamadas HTTP e endpoints |
| `data` | factories e massas de teste |
| `models` | contratos TypeScript |
| `specs` | cenários e assertions |

> **Melhoria aplicada:** os specs foram consolidados por **recurso**, evitando um arquivo para cada combinação de verbo e cenário.

```text
auth.spec.ts
booking.spec.ts
```

Dentro de `booking.spec.ts`, `test.describe` separa `GET`, `POST`, `PUT` e `DELETE`.

## Factory de Booking

> **Melhoria aplicada:** as reservas deixaram de utilizar massas fixas repetidas e passaram a ser criadas por uma única factory dinâmica.

`createBookingData()` gera uma reserva nova a cada chamada, incluindo nome, preço, datas e observação.

Quando um cenário precisa de alguma informação específica, utiliza **overrides**:

```ts
const booking = createBookingData({
  totalprice: 450,
  additionalneeds: 'Updated booking'
});
```

Dessa forma não é necessário manter uma função para cada variação do mesmo payload.

## Cobertura

### Auth

- token válido;
- credenciais inválidas;
- username ausente;
- password ausente;
- body vazio.

### Booking

- `GET /booking`;
- `GET /booking/{id}` positivo e negativo;
- `POST /booking` positivo;
- campos ausentes;
- body vazio;
- JSON malformado;
- método HTTP não suportado;
- `PUT` com token válido, ausente e inválido;
- confirmação da persistência por GET;
- `DELETE` com token válido, ausente e inválido;
- confirmação da exclusão por GET posterior.

Os fluxos positivos validam **status code, headers e body** conforme o contrato observado da API.

Os casos estão resumidos em [`casos-de-teste.md`](./casos-de-teste.md).

## Execução API

```bash
npm run test:api
```

Filtros disponíveis:

```bash
npm run test:api:smoke
npm run test:api:regression
npm run test:api:negative
npm run test:api:auth
npm run test:api:booking
npm run test:api:get
npm run test:api:post
npm run test:api:put
npm run test:api:delete
```

# E2E - Cucumber + Playwright

O E2E utiliza o SauceDemo e combina **BDD + Page Object Pattern**.

## Organização

| Pasta | Responsabilidade |
|---|---|
| `features` | cenários Gherkin em português |
| `pages` | locators e ações da interface |
| `steps` | ligação entre Gherkin e Page Objects |
| `data` | usuários, produto e factory de checkout |
| `support` | World, hooks e ciclo de vida do browser |

## Cenários

### Login

- autenticação válida;
- credenciais inválidas;
- campos obrigatórios por `Scenario Outline`;
- usuário bloqueado.

### Checkout

- produto no carrinho;
- dados do produto, preço e quantidade;
- checkout com sucesso;
- campos obrigatórios por `Scenario Outline`;
- produto no resumo;
- subtotal, imposto e total;
- conclusão do pedido.

### Navegação

- logout;
- Reset App State;
- All Items.

> **Melhoria aplicada:** os cenários repetitivos de campos obrigatórios foram escritos com **Scenario Outline + Examples**, reduzindo duplicação na feature sem perder cobertura.

## Validações E2E

> **Melhoria aplicada:** os asserts foram fortalecidos para validar não apenas a presença de elementos, mas também o estado funcional resultante de cada ação.

Os testes não verificam apenas visibilidade. Dependendo do fluxo também são validados:

- URL após a ação;
- título e estado da página;
- mensagem exata de erro;
- conteúdo do carrinho;
- nome, preço e quantidade do produto;
- subtotal, imposto e total;
- estado da sessão após login/logout;
- estado do carrinho após Reset App State e após conclusão do pedido.

Exemplo de validação de regra no checkout:

```ts
expect(subtotal).toBe(products.backpack.price);
expect(tax).toBeGreaterThan(0);
expect(total).toBeGreaterThan(subtotal);
expect(total).toBeCloseTo(subtotal + tax, 2);
```

Em caso de falha, o hook `After` captura screenshot e anexa a evidência ao relatório.

## Execução E2E

```bash
npm run test:e2e
```

Por grupo:

```bash
npm run test:e2e:login
npm run test:e2e:checkout
npm run test:e2e:menu
npm run test:e2e:smoke
npm run test:e2e:regression
```

Localmente o browser é visível com `slowMo`; no CI ele roda headless e sem atraso.

# Relatório Allure

API e E2E enviam seus resultados para:

```text
allure-results/
```

Executar as duas suítes e gerar o relatório:

```bash
npm run test:allure
```

Abrir o relatório já gerado:

```bash
npm run allure:open
```

No GitHub Actions os resultados de API e E2E são combinados em um relatório único e publicados como artifact:

```text
allure-automation-report-<run_number>
```

# CI/CD - GitHub Actions

Workflow funcional:

```text
.github/workflows/api-tests.yml
```

Fluxo:

```text
TypeScript validation
        |
        +--> API
        |
        +--> E2E
              |
              v
       Allure unificado
```

Comportamento:

- Pull Request para `main`: smoke tests;
- Push para `main`: regressão;
- Execução manual: escolha de `smoke`, `regression` ou `all` e de `dev`, `hml` ou `qa`.

# Performance - K6

A frente de performance executa `GET /booking` e valida durante a carga:

- HTTP `200`;
- `Content-Type` JSON;
- body como lista.

## Perfil progressivo

Perfil utilizado na execução demonstrativa:

```text
5 -> 10 -> 15 -> 20 -> 25 VUs
```

Thresholds:

```text
http_req_failed < 5%
p95 < 2000 ms
p99 < 3000 ms
checks > 95%
```

Resultado da execução progressiva:

| Métrica | Resultado |
|---|---:|
| Pico | 25 VUs |
| Requisições | 2.318 |
| Checks | 6.954 / 6.954 - 100% |
| Falhas HTTP | 0,00% |
| Throughput | 10,97 req/s |
| Média | 333,11 ms |
| p95 | 394,08 ms |
| p99 | 396,91 ms |
| Máximo | 681,78 ms |

A análise está em [`tests/performance/RESULTADO.md`](./tests/performance/RESULTADO.md).

## Perfil constante solicitado na avaliação

O script aceita:

```bash
K6_PROFILE=constant \
K6_VUS=500 \
K6_DURATION=5m \
k6 run tests/performance/load-test.js

<img width="599" height="453" alt="image" src="https://github.com/user-attachments/assets/60e2cf3f-8019-42e8-91f2-3ba86ac46da5" />

```

Foi executado um teste de carga progressiva com K6, aumentando a concorrência até **500** usuários virtuais. Durante a execução foram realizadas aproximadamente 76 mil requisições, sem falhas HTTP e com 100% dos checks atendidos. O p95 ficou em aproximadamente 394 ms e o p99 em 401 ms, ambos significativamente abaixo dos thresholds definidos. Dentro do cenário executado, não foi identificado indício de degradação relevante até 500 VUs.

O workflow de performance é manual:

```text
.github/workflows/performance-tests.yml
```

Ele permite configurar perfil, VUs, duração e URL e publica o relatório K6 como artifact.

# Observações sobre as aplicações públicas

A Restful Booker possui alguns comportamentos pouco convencionais que são respeitados pelos testes, por exemplo:

- autenticação inválida retorna HTTP `200` com `Bad credentials`;
- exclusão bem-sucedida retorna HTTP `201` com body `Created`;
- payloads inválidos específicos podem retornar HTTP `500`.

O SauceDemo não possui formulário real de cartão. Por isso, os cenários negativos do checkout foram aplicados aos campos que a própria aplicação disponibiliza: nome, sobrenome e CEP.

# Boas práticas aplicadas

- **configuração centralizada por ambiente**;
- TypeScript em modo `strict`;
- API Clients;
- **Test Data Factory com overrides**;
- **dados dinâmicos para reservas e checkout**;
- **specs organizados por recurso**;
- BDD com Cucumber/Gherkin;
- **Scenario Outline para cenários repetitivos**;
- Page Object Pattern;
- World isolado por cenário;
- **asserts de estado e dados de negócio**;
- tags de smoke, regressão, domínio e verbo;
- screenshots automáticos em falha;
- Allure unificado;
- CI/CD e artifacts;
- thresholds de performance.
