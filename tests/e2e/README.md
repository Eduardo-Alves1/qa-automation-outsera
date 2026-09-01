# E2E Automation

Automação web do SauceDemo com **Cucumber.js + Playwright + TypeScript**.

## Estrutura

```text
tests/e2e/
├── features/   # cenários BDD em Gherkin
├── pages/      # Page Objects
├── steps/      # implementação dos passos
├── data/       # usuários, produtos e factory de checkout
└── support/    # World e Hooks
```

## Padrões aplicados

- **Page Object Pattern:** locators e ações ficam nas classes de página.
- **BDD:** features escritas em português com `# language: pt`.
- **Scenario Outline:** utilizado em validações repetitivas de campos obrigatórios.
- **World por cenário:** mantém browser, páginas e dados do cenário isolados.
- **Dados dinâmicos:** dados de checkout são gerados por factory.
- **Configuração por ambiente:** URL e usuários vêm de `config/environments.ts`.
- **Evidência em falha:** screenshot anexado ao relatório Allure pelo hook `After`.

## Cobertura

### Login

- login válido;
- credenciais inválidas;
- campos obrigatórios;
- usuário bloqueado.

Além da mensagem esperada, os cenários validam URL e estado da tela após a tentativa de login.

### Checkout

- produto adicionado ao carrinho;
- produto, preço e quantidade no carrinho;
- formulário de checkout;
- campos obrigatórios por Scenario Outline;
- produto no resumo;
- subtotal, imposto e total;
- conclusão da compra e estado final do carrinho.

### Menu

- logout;
- Reset App State;
- retorno ao catálogo por All Items.

## Execução

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

O ambiente é escolhido por `TEST_ENV`. Exemplo:

```bash
TEST_ENV=hml npm run test:e2e
```

Os ambientes disponíveis são `dev`, `hml` e `qa`, configurados no `.env` a partir do `.env.example`.
