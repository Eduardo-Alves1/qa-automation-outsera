# E2E Automation

Automação E2E da aplicação **SauceDemo** utilizando **Cucumber.js + Playwright + TypeScript**, com cenários BDD em português, Page Object Pattern, evidências de falha e integração com Allure.

## Estrutura

```text
tests/e2e/
├── features/
│   ├── login.feature
│   ├── checkout.feature
│   └── menu.feature
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── MenuPage.ts
├── steps/
│   ├── login.steps.ts
│   ├── checkout.steps.ts
│   └── menu.steps.ts
├── support/
│   ├── hooks.ts
│   └── world.ts
└── data/
    └── users.data.ts
```

## Responsabilidades

- `features`: cenários BDD escritos em Gherkin com `# language: pt`;
- `pages`: Page Objects que encapsulam locators e ações da interface;
- `steps`: definições Cucumber que conectam Gherkin aos Page Objects;
- `support`: ciclo de vida do browser, World e captura de evidências;
- `data`: usuários, produto e dados de checkout.

## Cobertura

### Login

- credenciais válidas;
- credenciais inválidas;
- usuário ausente;
- senha ausente;
- usuário bloqueado.

### Checkout

- fluxo completo de compra;
- campos obrigatórios ausentes;
- nome, sobrenome ou CEP ausente;
- produto presente no resumo;
- consistência entre subtotal, imposto e total.

### Menu

- logout;
- reset do estado da aplicação;
- navegação para `All Items`.

## Configuração

```env
E2E_BASE_URL=https://www.saucedemo.com
```

## Execução

```bash
npm run test:e2e
```

Execuções segmentadas:

```bash
npm run test:e2e:login
npm run test:e2e:checkout
npm run test:e2e:menu
npm run test:e2e:smoke
npm run test:e2e:regression
```

## Browser e estabilidade

Cada cenário cria um novo BrowserContext no hook `Before` e libera os recursos no `After`, reduzindo dependência entre cenários.

Localmente o Chromium é executado de forma visível com `slowMo`; no GitHub Actions, `CI=true` utiliza execução headless e sem atraso.

Quando um cenário falha, o hook `After` captura screenshot e anexa a evidência ao Cucumber/Allure.

## Relatório

O formatter `allure-cucumberjs/reporter`, configurado em `cucumber.cjs`, grava os resultados em `allure-results/`. Esses resultados são combinados com os testes de API no relatório Allure unificado do pipeline.
