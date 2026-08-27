# QA Automation Outsera

Projeto de automação de testes desenvolvido para uma avaliação técnica, cobrindo três frentes: **API**, **End-to-End (E2E)** e **Performance**. A solução utiliza **Playwright + TypeScript**, **Cucumber.js**, **K6**, **Allure Report** e **GitHub Actions**, com separação de responsabilidades, cenários positivos e negativos, evidências e execução automatizada.

O projeto foi estruturado como uma entrega próxima de um cenário real de produção, priorizando legibilidade, isolamento dos testes, configuração externa, rastreabilidade, relatórios e execução em CI/CD.

> **Mobile não foi implementado.** A própria avaliação classifica essa frente como opcional, e ela foi intencionalmente deixada fora do escopo desta entrega.

## Atendimento à avaliação

| Requisito | Status | Implementação |
|---|---|---|
| API — status code, headers e body | ✅ | Playwright Test |
| API — cenários positivos e negativos | ✅ | Auth e Booking |
| API — GET, POST, PUT e DELETE | ✅ | Restful Booker |
| API — dados ausentes | ✅ | Cenários negativos |
| API — autenticação inválida | ✅ | Auth, PUT e DELETE |
| API — payload JSON malformado | ✅ | POST `/booking` |
| API — método HTTP inválido | ✅ | POST indevido em `/booking/{id}` |
| API — relatório detalhado | ✅ | Allure Report |
| E2E — Cucumber + Playwright | ✅ | SauceDemo |
| E2E — login positivo e negativo | ✅ | Gherkin + Page Objects |
| E2E — campos obrigatórios | ✅ | Login e Checkout |
| E2E — navegação | ✅ | Produtos, carrinho e menu |
| E2E — checkout positivo e negativo | ✅ | Carrinho, dados do cliente e finalização |
| E2E — Page Object Pattern | ✅ | `tests/e2e/pages` |
| E2E — evidências em falha | ✅ | Screenshot anexado ao Allure |
| CI/CD — execução de API e E2E após commits | ✅ | GitHub Actions |
| CI/CD — relatório das execuções | ✅ | Allure unificado como artifact |
| Performance — K6 | ✅ | Perfil progressivo e perfil constante |
| Performance — métricas e thresholds | ✅ | p95, p99, falhas, checks e throughput |
| Performance — relatório e análise | ✅ | `tests/performance/RESULTADO.md` + HTML exportável |
| Performance — configuração 500 VUs / 5 min | ⚙️ Suportada | Perfil `constant`, para ambiente autorizado |
| Mobile | ⏭️ Fora do escopo | Item opcional da avaliação |

## Tecnologias e versões

| Tecnologia | Versão / configuração | Finalidade |
|---|---:|---|
| Node.js | 24.x | Runtime JavaScript |
| TypeScript | ^7.0.2 | Linguagem e tipagem estática |
| Playwright Test | ^1.62.1 | Automação de API e browser |
| Cucumber.js | ^13.2.1 | BDD e execução E2E |
| @cucumber/messages | ^34.2.0 | Mensagens do runtime Cucumber |
| Allure | ^3.16.0 | Geração do relatório |
| allure-playwright | ^3.11.0 | Playwright Test + Allure |
| allure-cucumberjs | ^3.11.0 | Cucumber.js + Allure |
| tsx | ^4.23.12 | Execução TypeScript no Cucumber |
| dotenv | ^17.4.2 | Variáveis de ambiente |
| K6 | CLI externo | Testes de performance |
| GitHub Actions | `actions/*@v4` e Grafana K6 Action | CI/CD |

As dependências Node estão registradas em `package.json` e `package-lock.json`. A versão do binário K6 instalado no ambiente pode ser consultada com:

```bash
k6 version
```

## Aplicações utilizadas

### API — Restful Booker

```env
BASE_API_URL=https://restful-booker.herokuapp.com
```

A API foi utilizada para autenticação, CRUD de reservas e performance controlada.

### E2E — SauceDemo

```env
E2E_BASE_URL=https://www.saucedemo.com
```

O SauceDemo foi utilizado para login, navegação, carrinho, checkout e menu lateral.

> **Limitação do checkout:** o SauceDemo não disponibiliza formulário real de cartão/pagamento. Por isso, os cenários negativos foram aplicados aos campos efetivamente disponibilizados pela aplicação — nome, sobrenome e CEP — mantendo a intenção da avaliação de validar dados obrigatórios e falhas esperadas.

## Arquitetura do projeto

```text
qa-automation-outsera/
├── .github/
│   └── workflows/
│       ├── api-tests.yml
│       └── performance-tests.yml
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
│   │       └── *.spec.ts
│   │
│   ├── e2e/
│   │   ├── data/
│   │   │   └── users.data.ts
│   │   ├── features/
│   │   │   ├── login.feature
│   │   │   ├── checkout.feature
│   │   │   └── menu.feature
│   │   ├── pages/
│   │   │   ├── LoginPage.ts
│   │   │   ├── InventoryPage.ts
│   │   │   ├── CartPage.ts
│   │   │   ├── CheckoutPage.ts
│   │   │   └── MenuPage.ts
│   │   ├── steps/
│   │   │   ├── login.steps.ts
│   │   │   ├── checkout.steps.ts
│   │   │   └── menu.steps.ts
│   │   └── support/
│   │       ├── hooks.ts
│   │       └── world.ts
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
├── tsconfig.json
├── package.json
├── package-lock.json
├── RESUMO_IMPLEMENTACAO_AUTOMACAO.md
└── README.md
```

## Padrões e decisões de arquitetura

### API

A camada de API foi dividida em responsabilidades:

| Camada | Responsabilidade |
|---|---|
| `clients` | encapsula endpoints e chamadas HTTP |
| `data` | cria massas válidas, inválidas e incompletas |
| `models` | define contratos TypeScript |
| `specs` | concentra cenários, pré-condições e assertions |

Essa divisão reduz duplicação e evita misturar construção de payload, acesso HTTP e regras de validação dentro do mesmo bloco de teste.

### E2E

A automação web aplica **BDD + Page Object Pattern**:

| Camada | Responsabilidade |
|---|---|
| `features` | comportamento em Gherkin, escrito em português |
| `pages` | locators e ações de página |
| `steps` | ligação entre Gherkin e Page Objects |
| `data` | usuários, produtos e dados de checkout |
| `support/world.ts` | contexto compartilhado do cenário |
| `support/hooks.ts` | criação/encerramento do browser e evidências |

Cada cenário recebe seu próprio contexto de browser, reduzindo dependência entre testes. Em falhas, o `After` captura screenshot e anexa a evidência ao Cucumber/Allure.

### Performance

A frente de performance é independente das suítes funcionais e utiliza K6 com:

- perfil progressivo (`ramping-vus`);
- perfil constante (`constant-vus`);
- parâmetros via variáveis de ambiente;
- checks funcionais durante a carga;
- thresholds para erro e latência;
- think time de 1 segundo;
- relatório HTML e resumo JSON exportáveis.

## Pré-requisitos

Para API e E2E:

- Node.js 20 ou superior — recomendado 24.x;
- npm;
- Git;
- Chromium do Playwright.

Para performance:

- K6 instalado no ambiente.

Documentação oficial de instalação do K6: https://grafana.com/docs/k6/latest/set-up/install-k6/

## Instalação

Clone o projeto:

```bash
git clone git@github.com:Eduardo-Alves1/qa-automation-outsera.git
cd qa-automation-outsera
```

Instale as dependências Node:

```bash
npm install
```

Em CI, o projeto utiliza instalação reproduzível com:

```bash
npm ci
```

Instale o Chromium e as dependências necessárias ao E2E:

```bash
npx playwright install --with-deps chromium
```

## Configuração do ambiente

Crie o `.env` a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
BASE_API_URL=https://restful-booker.herokuapp.com
E2E_BASE_URL=https://www.saucedemo.com
```

O `.env` é ignorado pelo Git e não deve ser versionado.

## Validação TypeScript

```bash
npx tsc --noEmit
```

O projeto utiliza TypeScript em modo `strict`. Essa validação também é executada no início do pipeline.

# Testes de API

## Cobertura

### Autenticação

- criação de token com credenciais válidas;
- credenciais inválidas;
- username ausente;
- password ausente;
- body vazio.

### Booking

- listar reservas;
- consultar reserva por ID;
- consultar ID inexistente;
- criar reserva;
- payload com campos obrigatórios ausentes;
- body vazio;
- JSON malformado;
- atualizar com autenticação válida;
- atualizar sem token;
- atualizar com token inválido;
- verificar persistência após `PUT`;
- excluir com autenticação válida;
- excluir sem token;
- excluir com token inválido;
- verificar exclusão por `GET` posterior;
- método HTTP não suportado em `/booking/{id}`.

Os fluxos positivos de `GET`, `POST`, `PUT` e `DELETE` validam o contrato aplicável de **status code, headers e body**. Para o `DELETE`, o contrato observado retorna HTTP `201`, `Content-Type: text/plain` e body `Created`; a exclusão também é comprovada por consulta posterior.

## Execução

```bash
npm run test:api
```

Execuções segmentadas:

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

Os casos de teste funcionais da API estão documentados em:

[`casos-de-teste.md`](./casos-de-teste.md)

# Testes E2E

Os cenários utilizam Cucumber com `# language: pt` e Playwright para interação com o browser.

## Login

- login válido;
- credenciais inválidas;
- usuário obrigatório;
- senha obrigatória;
- usuário bloqueado.

## Checkout

- adicionar produto ao carrinho;
- acessar o carrinho;
- iniciar checkout;
- concluir compra com dados válidos;
- impedir checkout sem dados obrigatórios;
- nome ausente;
- sobrenome ausente;
- CEP ausente;
- validar produto no resumo;
- validar subtotal, imposto e total.

## Navegação e menu

- logout;
- reset do estado da aplicação;
- navegação para `All Items`;
- validação de retorno à página de produtos.

## Execução

```bash
npm run test:e2e
```

Por funcionalidade ou suíte:

```bash
npm run test:e2e:login
npm run test:e2e:checkout
npm run test:e2e:menu
npm run test:e2e:smoke
npm run test:e2e:regression
```

Um cenário individual também pode ser executado pelo nome:

```bash
npx cucumber-js \
  --config cucumber.cjs \
  --name "Realizar login com credenciais válidas"
```

## Browser local e CI

O hook adapta a execução ao ambiente:

```text
Local     → Chromium visível + slowMo
CI=true   → headless + sem slowMo
```

Isso facilita depuração local sem aumentar desnecessariamente o tempo do pipeline.

# Testes de Performance

O teste utiliza o mesmo domínio de API funcional, executando:

```text
GET /booking
```

Cada iteração valida:

- HTTP `200`;
- `Content-Type` JSON;
- body como lista de reservas.

## Perfil progressivo utilizado

O perfil padrão aumenta a concorrência em etapas:

```text
5 → 10 → 15 → 20 → 25 VUs
```

Com 30 segundos de sustentação por nível, 10 segundos de ramp entre os níveis e ramp down ao final.

Executar:

```bash
npm run test:performance
```

ou personalizar:

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

## Thresholds

```text
http_req_failed < 5%
p95 < 2000 ms
p99 < 3000 ms
checks > 95%
```

## Resultado real da execução progressiva

| Métrica | Resultado |
|---|---:|
| Pico de VUs | 25 |
| Requisições | 2.318 |
| Checks | 6.954 / 6.954 — 100% |
| Falhas HTTP | 0,00% |
| Throughput | 10,97 req/s |
| Tempo médio | 333,11 ms |
| p95 | 394,08 ms |
| p99 | 396,91 ms |
| Máximo | 681,78 ms |

Todos os thresholds foram atendidos. Dentro da carga efetivamente testada, não foi identificado ponto de saturação ou gargalo crítico.

A análise completa, incluindo o baseline de 5 VUs, está em:

[`tests/performance/RESULTADO.md`](./tests/performance/RESULTADO.md)

## Configuração solicitada na avaliação — 500 VUs / 5 minutos

O script também oferece perfil constante:

```bash
K6_PROFILE=constant \
K6_VUS=500 \
K6_DURATION=5m \
k6 run tests/performance/load-test.js
```

Essa configuração reproduz o formato solicitado pela avaliação, mas **não foi executada contra a Restful Booker pública**, pois se trata de um serviço compartilhado de terceiros. O perfil permanece disponível para execução pelo avaliador em ambiente autorizado.

## Relatório K6

Para gerar dashboard HTML e resumo JSON:

```bash
mkdir -p performance-results

K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT=performance-results/k6-report.html \
k6 run \
  --summary-export=performance-results/k6-summary.json \
  tests/performance/load-test.js
```

Os resultados de execução não são versionados; `performance-results/` está no `.gitignore`.

# Relatórios e evidências

## Allure — API + E2E

API e E2E escrevem resultados na mesma estrutura:

```text
allure-results/
```

Integrações:

```text
API → allure-playwright
E2E → allure-cucumberjs/reporter
```

Para executar API + E2E e gerar relatório local:

```bash
npm run test:allure
```

Ou separadamente:

```bash
npm run allure:clean
npm run test:api
npm run test:e2e
npm run allure:generate
npm run allure:open
```

O relatório é criado em:

```text
allure-report/
```

### Evidência de falha E2E

Quando um cenário Cucumber falha, o hook `After` captura um screenshot e o anexa à execução. O `allure-cucumberjs` inclui esse attachment no relatório.

# CI/CD — GitHub Actions

## Pipeline funcional

Workflow:

```text
.github/workflows/api-tests.yml
```

Apesar do nome histórico do arquivo, ele executa API e E2E.

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

Também existe execução manual com `workflow_dispatch`, permitindo selecionar `smoke`, `regression` ou `all`.

O job E2E instala Chromium e dependências de sistema automaticamente:

```bash
npx playwright install --with-deps chromium
```

Os resultados de API e E2E são enviados como artifacts separados, combinados no job final e publicados no artifact:

```text
allure-automation-report-<run_number>
```

## Pipeline de performance

Workflow:

```text
.github/workflows/performance-tests.yml
```

A execução é **manual**, evitando que testes de carga sejam disparados automaticamente a cada commit contra uma API pública. O avaliador pode escolher:

- perfil `ramp` ou `constant`;
- quantidade de VUs;
- duração;
- VUs iniciais e incremento;
- tempos de ramp;
- URL alvo.

Ao final, o workflow publica `k6-report.html` e `k6-summary.json` como artifact.

# Estratégia de tags

## API

```text
@api @auth @booking
@get @post @put @delete
@positive @negative
@smoke @regression
```

## E2E

```text
@e2e @login @checkout @menu
@positive @negative
@smoke @regression
```

As tags permitem executar subconjuntos adequados ao contexto, como smoke em Pull Requests e regressão em `main`.

# Observações sobre o contrato da Restful Booker

A automação valida o **contrato observado da API**, mesmo quando ele difere de convenções REST comuns. Exemplos:

- autenticação inválida retorna HTTP `200` com `reason: "Bad credentials"`;
- exclusão bem-sucedida retorna HTTP `201`;
- determinados payloads inválidos podem retornar HTTP `500`;
- JSON malformado é rejeitado com resposta de erro;
- o efeito de `PUT` e `DELETE` é validado com consultas posteriores.

Essa decisão evita alterar a expectativa do teste apenas para seguir uma convenção teórica diferente do comportamento real da API utilizada.

# Boas práticas aplicadas

- TypeScript em modo `strict`;
- Page Object Pattern no E2E;
- BDD com Cucumber/Gherkin;
- clients, models, data e specs separados na API;
- massas reutilizáveis e criação dinâmica de reservas;
- independência entre cenários;
- validações de status, headers e body;
- cenários positivos e negativos;
- validação do efeito de operações de escrita;
- variáveis de ambiente para URLs e configuração de carga;
- screenshots automáticos em falha E2E;
- tags de smoke, regressão, domínio e método HTTP;
- Allure consolidado para API e E2E;
- thresholds de performance;
- CI/CD com validação TypeScript;
- execução de performance isolada e sob demanda;
- artifacts de relatórios e evidências;
- arquivos gerados excluídos do versionamento.

# Documentação complementar

- Casos de teste da API: [`casos-de-teste.md`](./casos-de-teste.md)
- Detalhes do E2E: [`tests/e2e/README.md`](./tests/e2e/README.md)
- Performance: [`tests/performance/README.md`](./tests/performance/README.md)
- Resultado de performance: [`tests/performance/RESULTADO.md`](./tests/performance/RESULTADO.md)
