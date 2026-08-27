# QA Automation Outsera

Projeto de automação de testes desenvolvido como avaliação técnica, com foco em **API**, **End-to-End (E2E)**, **BDD**, evidências de execução, relatórios com **Allure Report** e integração contínua com **GitHub Actions**.

A solução utiliza **Playwright + TypeScript** para API, **Cucumber.js + Playwright** para E2E e mantém API e E2E separados por responsabilidade, mas consolida os resultados em um único relatório Allure.

## Status da avaliação

| Frente | Status | Implementação |
|---|---|---|
| Testes automatizados de API | ✅ Implementado | Playwright + TypeScript |
| Cenários positivos e negativos de API | ✅ Implementado | GET, POST, PUT e DELETE |
| Payload malformado, dados ausentes e autenticação inválida | ✅ Implementado | Restful Booker |
| Relatório dos testes de API | ✅ Implementado | Allure Playwright |
| Testes E2E com Cucumber | ✅ Implementado | Cucumber.js + Playwright |
| Login positivo e negativo | ✅ Implementado | SauceDemo |
| Checkout positivo e negativo | ✅ Implementado | SauceDemo |
| Page Object Pattern | ✅ Implementado | Camada `pages` |
| Evidência em falha E2E | ✅ Implementado | Screenshot anexado ao Cucumber/Allure |
| CI/CD API + E2E | ✅ Implementado | GitHub Actions |
| Relatório consolidado API + E2E | ✅ Implementado | Allure Report |
| Teste de carga | ⏳ Pendente | K6 — item opcional da avaliação |
| Teste mobile | ⏭️ Fora do escopo | Item opcional da avaliação |

## Tecnologias utilizadas

| Tecnologia | Versão declarada | Finalidade |
|---|---:|---|
| Node.js | 24.x | Runtime JavaScript |
| TypeScript | ^7.0.2 | Linguagem e tipagem estática |
| Playwright Test | ^1.62.1 | Automação de API e browser |
| Cucumber.js | ^13.2.1 | BDD e execução dos cenários E2E |
| @cucumber/messages | ^34.2.0 | Mensagens do runtime Cucumber |
| Allure | ^3.16.0 | Geração do relatório |
| allure-playwright | ^3.11.0 | Integração Playwright Test + Allure |
| allure-cucumberjs | ^3.11.0 | Integração Cucumber.js + Allure |
| tsx | ^4.23.12 | Execução TypeScript no Cucumber |
| dotenv | ^17.4.2 | Variáveis de ambiente |
| GitHub Actions | CI/CD | Pipeline automatizado |

As versões utilizadas estão registradas em `package.json` e `package-lock.json`.

## Aplicações utilizadas

### API — Restful Booker

Os testes de API utilizam:

```env
BASE_API_URL=https://restful-booker.herokuapp.com
```

A suíte cobre autenticação e reservas utilizando diferentes métodos HTTP.

### E2E — SauceDemo

Os testes web utilizam:

```env
E2E_BASE_URL=https://www.saucedemo.com
```

Os cenários E2E cobrem login, checkout e operações do menu lateral.

> **Limitação do ambiente de demonstração:** o SauceDemo não disponibiliza campos reais de cartão ou processamento de pagamento. Por esse motivo, os cenários negativos de checkout validam os campos obrigatórios realmente disponibilizados pela aplicação, como nome, sobrenome e CEP.

## Arquitetura do projeto

```text
qa-automation-outsera/
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── tests/
│   ├── api/
│   │   ├── clients/
│   │   ├── data/
│   │   ├── models/
│   │   └── specs/
│   │
│   └── e2e/
│       ├── data/
│       ├── features/
│       │   ├── login.feature
│       │   ├── checkout.feature
│       │   └── menu.feature
│       ├── pages/
│       │   ├── LoginPage.ts
│       │   ├── InventoryPage.ts
│       │   ├── CartPage.ts
│       │   ├── CheckoutPage.ts
│       │   └── MenuPage.ts
│       ├── steps/
│       │   ├── login.steps.ts
│       │   ├── checkout.steps.ts
│       │   └── menu.steps.ts
│       └── support/
│           ├── hooks.ts
│           └── world.ts
│
├── .env.example
├── casos-de-teste.md
├── cucumber.cjs
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidade das camadas

| Camada | Responsabilidade |
|---|---|
| `tests/api/clients` | Encapsula chamadas HTTP e endpoints |
| `tests/api/data` | Centraliza massas válidas e inválidas |
| `tests/api/models` | Define contratos TypeScript |
| `tests/api/specs` | Contém cenários e assertions de API |
| `tests/e2e/features` | Especificações BDD escritas em Gherkin |
| `tests/e2e/pages` | Page Objects e locators da aplicação web |
| `tests/e2e/steps` | Implementação dos passos Cucumber |
| `tests/e2e/support` | World, browser lifecycle, hooks e evidências |
| `.github/workflows` | Pipeline CI/CD |

## Cobertura de API

A suíte implementa validações de `status code`, `headers` e `body`, cenários positivos e negativos e os métodos HTTP exigidos pela avaliação.

### Autenticação

- token com credenciais válidas;
- credenciais inválidas;
- username ausente;
- password ausente;
- body vazio.

### Booking

- listar reservas;
- consultar reserva por ID;
- consultar ID inexistente;
- criar reserva;
- criar reserva com campos ausentes;
- criar reserva com body vazio;
- criar reserva com JSON malformado;
- atualizar reserva com token válido;
- atualizar sem token;
- atualizar com token inválido;
- validar persistência após PUT;
- excluir com token válido;
- excluir sem token;
- excluir com token inválido;
- validar exclusão por GET posterior;
- validar método HTTP não suportado.

## Cobertura E2E

Os arquivos `.feature` utilizam `# language: pt` e os cenários são escritos em português.

### Login

- login com credenciais válidas;
- credenciais inválidas;
- usuário obrigatório;
- senha obrigatória;
- usuário bloqueado.

### Checkout

- checkout concluído com sucesso;
- dados obrigatórios ausentes;
- nome ausente;
- sobrenome ausente;
- CEP ausente;
- validação do produto no resumo;
- validação de subtotal, imposto e total.

### Menu lateral

- logout;
- reset do estado da aplicação;
- retorno para a lista de produtos por `All Items`.

Cada cenário cria seu próprio contexto de browser e prepara suas próprias pré-condições, evitando dependência entre cenários.

## Estratégia de tags

As suítes podem ser segmentadas por tags.

### API

```text
@api @auth @booking
@get @post @put @delete
@positive @negative
@smoke @regression
```

### E2E

```text
@e2e @login @checkout @menu
@positive @negative
@smoke @regression
```

## Pré-requisitos

- Node.js 20 ou superior;
- npm;
- Git;
- Chromium instalado pelo Playwright para a frente E2E.

A versão utilizada no projeto e no pipeline é Node.js 24.x.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone git@github.com:Eduardo-Alves1/qa-automation-outsera.git
cd qa-automation-outsera
npm install
```

Instale o Chromium e as dependências de sistema necessárias ao Playwright:

```bash
npx playwright install --with-deps chromium
```

No GitHub Actions essa instalação é feita automaticamente no job E2E.

## Configuração do ambiente

Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
BASE_API_URL=https://restful-booker.herokuapp.com
E2E_BASE_URL=https://www.saucedemo.com
```

O arquivo `.env` não deve ser versionado.

## Validação do TypeScript

```bash
npx tsc --noEmit
```

Essa validação também é a primeira etapa do pipeline.

## Execução dos testes

### API + E2E

```bash
npm test
```

ou:

```bash
npm run test:all
```

### API

```bash
npm run test:api
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

### E2E

```bash
npm run test:e2e
npm run test:e2e:login
npm run test:e2e:checkout
npm run test:e2e:menu
npm run test:e2e:smoke
npm run test:e2e:regression
```

Um cenário Cucumber também pode ser executado pelo nome:

```bash
npx cucumber-js --config cucumber.cjs --name "Realizar login com credenciais válidas"
```

## Browser durante o E2E

O hook de browser diferencia execução local de CI:

```text
Execução local → Chromium visível + slowMo para facilitar acompanhamento
CI=true        → headless + sem slowMo
```

Isso permite acompanhar visualmente os testes durante desenvolvimento sem penalizar o tempo do pipeline.

## Relatórios com Allure

API e E2E escrevem resultados compatíveis na mesma estrutura:

```text
allure-results/
```

- API: `allure-playwright`;
- E2E: `allure-cucumberjs/reporter`.

### Gerar um relatório unificado localmente

O comando abaixo remove evidências antigas, executa API e E2E e gera um novo relatório:

```bash
npm run test:allure
```

Também é possível executar manualmente:

```bash
npm run allure:clean
npm run test:api
npm run test:e2e
npm run allure:generate
npm run allure:open
```

O relatório final é criado em:

```text
allure-report/
```

### Evidências de falha E2E

O hook `After` captura screenshot quando um cenário Cucumber falha e anexa a imagem à execução. O formatter `allure-cucumberjs` processa os attachments do Cucumber, permitindo que a evidência acompanhe o cenário no relatório.

As pastas `allure-results/` e `allure-report/` são artefatos de execução e não devem ser versionadas.

## CI/CD — GitHub Actions

O workflow está em:

```text
.github/workflows/api-tests.yml
```

Apesar do nome histórico do arquivo, o workflow executa atualmente API e E2E.

### Pull Request para `main`

```text
TypeScript validation
        │
        ├───────────────┐
        ▼               ▼
   API Smoke        E2E Smoke
        │               │
        └───────┬───────┘
                ▼
       Allure unificado
                ▼
          GitHub Artifact
```

### Push para `main`

```text
TypeScript validation
        │
        ├───────────────────┐
        ▼                   ▼
 API Regression       E2E Regression
        │                   │
        └─────────┬─────────┘
                  ▼
         Allure unificado
                  ▼
           GitHub Artifact
```

### Execução manual

O `workflow_dispatch` permite escolher:

```text
smoke
regression
all
```

No job E2E, o pipeline instala Chromium e suas dependências com:

```bash
npx playwright install --with-deps chromium
```

Os jobs de API e E2E fazem upload dos resultados Allure separadamente. O job final baixa e combina os resultados, gera um único relatório e publica o artifact:

```text
allure-automation-report-<run_number>
```

O relatório é gerado mesmo após falhas de teste sempre que existirem resultados, preservando evidências para investigação. A falha da suíte continua fazendo o workflow sinalizar o problema normalmente.

## Observações sobre a Restful Booker

A suíte valida o contrato observado da API utilizada. Alguns retornos diferem de convenções REST mais comuns, por exemplo:

- autenticação inválida pode retornar HTTP `200` com `reason: "Bad credentials"`;
- exclusão bem-sucedida retorna HTTP `201`;
- determinados payloads inválidos retornam HTTP `500`.

Os testes registram essas características explicitamente em vez de substituir o contrato real por uma expectativa teórica.

## Boas práticas aplicadas

- TypeScript em modo `strict`;
- Page Object Pattern;
- separação entre feature, steps, page objects e massa de dados;
- clients, models, data e specs separados na API;
- massas criadas dinamicamente quando possível;
- cenários independentes;
- assertions específicas para regras positivas e negativas;
- variáveis de ambiente para URLs;
- screenshots automáticos em falha E2E;
- execução seletiva por tags;
- validação TypeScript no CI;
- smoke tests em Pull Request;
- regressão em push para `main`;
- API e E2E executados em jobs independentes;
- relatório Allure consolidado como artifact do pipeline.

## Documentação dos casos de teste

Os casos de teste funcionais da frente de API estão documentados em:

[`casos-de-teste.md`](./casos-de-teste.md)

Os cenários E2E estão documentados diretamente nos arquivos Gherkin em `tests/e2e/features`.

## Próxima etapa — Performance

A frente restante planejada é o item opcional de **teste de carga com K6**.

A proposta é manter essa camada isolada em:

```text
tests/performance/
```

O cenário solicitado pela avaliação prevê **500 usuários virtuais simultâneos durante 5 minutos**, incluindo métricas, thresholds e análise dos resultados.

Para evitar gerar carga indevida sobre uma API pública de terceiros, a execução de 500 usuários deve utilizar um endpoint controlado ou mock apropriado para teste de carga.
