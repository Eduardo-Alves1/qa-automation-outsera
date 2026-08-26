# E2E Automation

Estrutura inicial da automacao E2E utilizando SauceDemo como aplicacao de teste.

## Estrutura

```text
tests/e2e/
├── features/
│   ├── login.feature
│   └── checkout.feature
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── steps/
│   ├── login.steps.ts
│   └── checkout.steps.ts
├── support/
│   ├── hooks.ts
│   └── world.ts
└── data/
    └── users.data.ts
```

## Responsabilidades

- `features`: cenarios BDD escritos em Gherkin.
- `pages`: Page Objects que encapsulam elementos e acoes da interface.
- `steps`: definicoes Cucumber que conectarao os passos Gherkin aos Page Objects.
- `support`: ciclo de vida do browser, contexto, pagina e World do Cucumber.
- `data`: usuarios, dados de checkout e produtos utilizados pelos cenarios.

## Estado atual

A estrutura, os cenarios Gherkin, os Page Objects e as massas iniciais ja estao criados. Os arquivos de steps e hooks permanecem como placeholders ate a integracao de `@cucumber/cucumber` e do runtime TypeScript, que sera realizada na proxima etapa.

A URL da aplicacao deve ser configurada por meio de:

```env
E2E_BASE_URL=https://www.saucedemo.com
```
