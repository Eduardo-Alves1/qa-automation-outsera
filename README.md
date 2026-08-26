# QA Automation Outsera

Projeto de automação de testes desenvolvido com **Playwright + TypeScript**, com foco inicial na validação de APIs REST utilizando a **Restful Booker** como API pública de apoio.

A suíte foi estruturada com separação de responsabilidades, tipagem forte, massas de teste reutilizáveis, cenários positivos e negativos, execução por tags e geração de evidências com **Allure Report**.

## Objetivos

O projeto tem como objetivos:

- automatizar testes de API com Playwright;
- validar `status code`, `headers` e `body` das respostas;
- cobrir cenários positivos e negativos;
- exercitar os métodos HTTP `GET`, `POST`, `PUT` e `DELETE`;
- validar autenticação e autorização;
- evitar dependência de massas fixas sempre que possível;
- permitir execuções segmentadas por tags;
- gerar relatórios de execução com Allure;
- manter uma estrutura preparada para evolução do projeto.

> Atualmente, o repositório contém a suíte de testes automatizados de API. As próximas etapas da avaliação serão adicionadas gradualmente ao mesmo projeto.

## Tecnologias utilizadas

| Tecnologia | Versão declarada | Finalidade |
|---|---:|---|
| Node.js | 24.x recomendado | Runtime JavaScript |
| TypeScript | ^7.0.2 | Linguagem e tipagem estática |
| Playwright Test | ^1.62.1 | Framework de automação |
| Allure | ^3.16.0 | Geração do relatório |
| allure-playwright | ^3.11.0 | Integração Playwright + Allure |
| dotenv | ^17.4.2 | Variáveis de ambiente |
| @types/node | ^26.2.0 | Tipagens do Node.js |

As versões declaradas podem ser consultadas em `package.json` e `package-lock.json`.

## API utilizada

A suíte utiliza a **Restful Booker** como API pública de testes.

A URL base não é fixada diretamente nos testes. Ela é carregada pela variável de ambiente:

```env
BASE_API_URL=https://restful-booker.herokuapp.com
```

Essa configuração é lida pelo `playwright.config.ts` e disponibilizada aos testes por meio do `baseURL` do Playwright.

## Arquitetura do projeto

```text
qa-automation-outsera/
├── tests/
│   └── api/
│       ├── clients/
│       │   ├── auth.client.ts
│       │   └── booking.client.ts
│       ├── data/
│       │   ├── auth.data.ts
│       │   └── booking.data.ts
│       ├── models/
│       │   ├── auth.model.ts
│       │   └── booking.model.ts
│       └── specs/
│           ├── auth.post.spec.ts
│           ├── auth.post.negative.spec.ts
│           ├── booking.get.spec.ts
│           ├── booking.get-by-id.spec.ts
│           ├── booking.get-by-id.negative.spec.ts
│           ├── booking.post.spec.ts
│           ├── booking.post.negative.spec.ts
│           ├── booking.put.spec.ts
│           ├── booking.put.negative.spec.ts
│           ├── booking.delete.spec.ts
│           └── booking.delete.negative.spec.ts
├── casos-de-teste.md
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidade das camadas

| Diretório | Responsabilidade |
|---|---|
| `clients` | Encapsula as chamadas HTTP e os endpoints da API |
| `data` | Centraliza massas de dados válidas, inválidas e incompletas |
| `models` | Define contratos e interfaces TypeScript |
| `specs` | Contém os cenários, pré-condições e assertions |

Essa separação evita concentrar construção de payloads, comunicação HTTP e validações no mesmo arquivo de teste.

## Cenários cobertos

A suíte atual cobre cenários positivos e negativos para autenticação e reservas.

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
- criar reserva sem campos obrigatórios;
- criar reserva com body vazio;
- atualizar reserva com token válido;
- atualizar reserva sem token;
- atualizar reserva com token inválido;
- excluir reserva com token válido;
- excluir reserva sem token;
- excluir reserva com token inválido.

Nos fluxos de alteração e exclusão, a suíte também verifica o efeito final da operação. Por exemplo:

```text
PUT /booking/{id}
        ↓
GET /booking/{id}
        ↓
validação da persistência
```

```text
DELETE /booking/{id}
        ↓
GET /booking/{id}
        ↓
404
```

A descrição detalhada dos **18 casos de teste atualmente documentados** está disponível em [`casos-de-teste.md`](./casos-de-teste.md).

## Estratégia de tags

Os testes utilizam tags para permitir execuções seletivas.

### Por camada/domínio

- `@api`
- `@auth`
- `@booking`

### Por método HTTP

- `@get`
- `@post`
- `@put`
- `@delete`

### Por tipo de cenário

- `@positive`
- `@negative`

### Por suíte de execução

- `@smoke`
- `@regression`

Isso permite executar apenas o conjunto necessário para cada contexto, como smoke tests, regressão ou cenários negativos.

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js 20 ou superior;
- npm;
- Git.

A versão utilizada durante o desenvolvimento é Node.js 24.x.

Para validar:

```bash
node --version
npm --version
git --version
```

## Instalação

Clone o repositório:

```bash
git clone git@github.com:Eduardo-Alves1/qa-automation-outsera.git
```

Acesse o diretório:

```bash
cd qa-automation-outsera
```

Instale as dependências:

```bash
npm install
```

Como a suíte atual é somente de API, não é necessário instalar browsers para executar esses testes.

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
touch .env
```

Adicione:

```env
BASE_API_URL=https://restful-booker.herokuapp.com
```

O arquivo `.env` não deve ser versionado e está configurado no `.gitignore`.

## Validação do TypeScript

Antes da execução, é possível validar a tipagem do projeto sem gerar arquivos JavaScript:

```bash
npx tsc --noEmit
```

Se o comando finalizar sem erros, a validação de tipos foi concluída com sucesso.

## Execução dos testes

### Todos os testes

```bash
npm test
```

### Todos os testes de API

```bash
npm run test:api
```

### Smoke

```bash
npm run test:api:smoke
```

### Regressão

```bash
npm run test:api:regression
```

### Cenários negativos

```bash
npm run test:api:negative
```

### Auth

```bash
npm run test:api:auth
```

### Booking

```bash
npm run test:api:booking
```

### Por método HTTP

```bash
npm run test:api:get
npm run test:api:post
npm run test:api:put
npm run test:api:delete
```

Também é possível executar diretamente pelo Playwright:

```bash
npx playwright test tests/api
```

## Relatórios com Allure

A suíte utiliza o **Allure Report** como relatório principal.

O reporter está configurado em `playwright.config.ts` para gerar os resultados brutos em:

```text
allure-results/
```

### 1. Executar os testes

```bash
npm run test:api
```

### 2. Gerar o relatório

```bash
npm run allure:generate
```

Esse comando gera o relatório em:

```text
allure-report/
```

### 3. Abrir o relatório

```bash
npm run allure:open
```

Também é possível gerar e visualizar um relatório temporário diretamente a partir dos resultados:

```bash
npx allure serve allure-results
```

As pastas `allure-results/` e `allure-report/` são artefatos de execução e não são versionadas.

## Configuração do Playwright

Entre as principais configurações existentes em `playwright.config.ts` estão:

- diretório de testes em `./tests`;
- timeout global de 30 segundos;
- execução paralela habilitada;
- retries somente em CI;
- `baseURL` configurada por variável de ambiente;
- headers padrão `Accept` e `Content-Type` como `application/json`;
- Allure como reporter principal;
- trace preservado em caso de falha.

O trace pode auxiliar na análise de falhas durante execuções automatizadas.

## Observações sobre o contrato da Restful Booker

Alguns comportamentos da API utilizada não seguem necessariamente o padrão mais comum de APIs REST. Os testes foram implementados para validar o **contrato observado da API**, e não para substituir esse contrato por uma expectativa teórica.

Exemplos existentes na suíte:

- autenticação inválida retorna HTTP `200` e informa a falha por meio de `reason: "Bad credentials"`;
- exclusão bem-sucedida retorna HTTP `201`;
- determinados payloads inválidos de criação retornam HTTP `500`.

Esses comportamentos são tratados explicitamente nos cenários automatizados.

## Boas práticas aplicadas

- separação entre client, massa de dados, model e spec;
- uso de TypeScript em modo `strict`;
- uso de `APIRequestContext` do Playwright;
- retorno de `APIResponse` pelos clients para permitir validação completa da resposta;
- criação dinâmica de reservas para reduzir dependência de IDs fixos;
- validação de status code, headers e body;
- cenários positivos e negativos;
- validação de persistência após atualização;
- validação do efeito da exclusão por consulta posterior;
- execução seletiva por tags;
- variáveis de ambiente para configuração externa;
- relatórios com Allure;
- trace mantido em caso de falha.

## Documentação de casos de teste

Os casos de teste detalhados, contendo pré-condições, passos e resultados esperados, estão disponíveis em:

[`casos-de-teste.md`](./casos-de-teste.md)

## CI/CD

A integração com CI/CD será adicionada na próxima etapa do projeto. A estratégia prevista é utilizar **GitHub Actions** para executar validação TypeScript, suítes de testes por contexto e disponibilizar os resultados/relatórios como artefatos da execução.

## Evolução do projeto

A arquitetura foi preparada para receber novas camadas da avaliação sem misturar responsabilidades. Entre as próximas evoluções estão:

- integração com GitHub Actions;
- automação E2E com Playwright;
- integração com Cucumber para os cenários E2E exigidos pela avaliação;
- testes de performance em estrutura separada;
- evolução das evidências e relatórios no pipeline.
