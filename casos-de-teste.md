# Casos de Teste - Suite de API

Este documento descreve os cenarios atualmente cobertos pela suite de testes automatizados da API Restful Booker.

## Contexto

- Ferramenta: Playwright Test
- Linguagem: TypeScript
- Tipo de teste: API
- Base URL: configurada via `BASE_API_URL`
- API alvo: Restful Booker

## Estrutura da Suite

- `tests/api/clients`: encapsula as chamadas HTTP para a API.
- `tests/api/data`: centraliza massas de dados validas e invalidas.
- `tests/api/models`: define contratos TypeScript dos payloads e respostas.
- `tests/api/specs`: contem os cenarios automatizados.

## Casos de Teste

### CT-001 - Criar token de autenticacao com sucesso

- Arquivo: `tests/api/specs/auth.post.spec.ts`
- Endpoint: `POST /auth`
- Tipo: positivo

**Pre-condicoes**

- Usuario e senha validos disponiveis na massa de dados.

**Passos**

1. Montar payload de autenticacao valido.
2. Enviar requisicao `POST /auth`.
3. Validar o status code da resposta.
4. Validar o tipo de conteudo da resposta.
5. Validar a existencia do token no corpo da resposta.

**Resultado esperado**

- A API deve retornar status `200`.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve possuir a propriedade `token`.
- O token retornado deve ser uma string.

---

### CT-002 - Tentar criar token com credenciais invalidas

- Arquivo: `tests/api/specs/auth.post.spec.ts`
- Endpoint: `POST /auth`
- Tipo: negativo

**Pre-condicoes**

- Usuario e senha invalidos disponiveis na massa de dados.

**Passos**

1. Montar payload de autenticacao invalido.
2. Enviar requisicao `POST /auth`.
3. Validar o status code da resposta.
4. Validar o tipo de conteudo da resposta.
5. Validar a mensagem de erro retornada pela API.

**Resultado esperado**

- A API deve retornar status `200`, conforme contrato atual da Restful Booker.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve conter `reason` igual a `Bad credentials`.

---

### CT-003 - Listar reservas com sucesso

- Arquivo: `tests/api/specs/booking.get.spec.ts`
- Endpoint: `GET /booking`
- Tipo: positivo

**Pre-condicoes**

- A API deve estar disponivel.

**Passos**

1. Enviar requisicao `GET /booking`.
2. Validar o status code da resposta.
3. Validar o tipo de conteudo da resposta.
4. Validar que o corpo retornado e uma lista.

**Resultado esperado**

- A API deve retornar status `200`.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve ser um array.

---

### CT-004 - Criar reserva com sucesso

- Arquivo: `tests/api/specs/booking.post.spec.ts`
- Endpoint: `POST /booking`
- Tipo: positivo

**Pre-condicoes**

- Massa de dados valida para criacao de reserva disponivel.

**Passos**

1. Montar payload valido de reserva.
2. Enviar requisicao `POST /booking`.
3. Validar o status code da resposta.
4. Validar o tipo de conteudo da resposta.
5. Validar que um `bookingid` foi retornado.
6. Validar que os dados da reserva retornada correspondem ao payload enviado.

**Resultado esperado**

- A API deve retornar status `200`.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve conter `bookingid`.
- O objeto `booking` retornado deve ser igual ao payload enviado.

---

### CT-005 - Consultar reserva por ID com sucesso

- Arquivo: `tests/api/specs/booking.get-by-id.spec.ts`
- Endpoint: `GET /booking/{bookingId}`
- Tipo: positivo

**Pre-condicoes**

- Uma reserva deve ser criada antes da consulta.
- O ID da reserva criada deve estar disponivel para a requisicao.

**Passos**

1. Criar uma reserva com payload valido.
2. Capturar o `bookingid` retornado.
3. Enviar requisicao `GET /booking/{bookingId}`.
4. Validar o status code da resposta.
5. Validar o tipo de conteudo da resposta.
6. Validar que os dados retornados correspondem aos dados usados na criacao.

**Resultado esperado**

- A criacao da reserva deve retornar status `200`.
- A consulta por ID deve retornar status `200`.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve ser igual aos dados da reserva criada.

---

### CT-006 - Atualizar reserva com sucesso

- Arquivo: `tests/api/specs/booking.put.spec.ts`
- Endpoint: `PUT /booking/{bookingId}`
- Tipo: positivo

**Pre-condicoes**

- Um token de autenticacao valido deve ser gerado.
- Uma reserva deve ser criada antes da atualizacao.
- O ID da reserva criada deve estar disponivel para a requisicao.

**Passos**

1. Gerar token de autenticacao valido via `POST /auth`.
2. Criar uma reserva com payload valido.
3. Capturar o `bookingid` retornado.
4. Montar payload valido com dados atualizados.
5. Enviar requisicao `PUT /booking/{bookingId}` usando o token.
6. Validar o status code da resposta.
7. Validar o tipo de conteudo da resposta.
8. Validar que o corpo retornado corresponde ao payload atualizado.

**Resultado esperado**

- A autenticacao deve retornar status `200`.
- A criacao da reserva deve retornar status `200`.
- A atualizacao deve retornar status `200`.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve ser igual aos dados atualizados.

---

### CT-007 - Deletar reserva com sucesso

- Arquivo: `tests/api/specs/booking.delete.spec.ts`
- Endpoint: `DELETE /booking/{bookingId}`
- Tipo: positivo

**Pre-condicoes**

- Um token de autenticacao valido deve ser gerado.
- Uma reserva deve ser criada antes da exclusao.
- O ID da reserva criada deve estar disponivel para a requisicao.

**Passos**

1. Gerar token de autenticacao valido via `POST /auth`.
2. Criar uma reserva com payload valido.
3. Capturar o `bookingid` retornado.
4. Enviar requisicao `DELETE /booking/{bookingId}` usando o token.
5. Validar o status code da exclusao.
6. Consultar novamente a reserva deletada por ID.
7. Validar que a reserva nao esta mais disponivel.

**Resultado esperado**

- A exclusao deve retornar status `201`.
- A consulta posterior por ID deve retornar status `404`.

---

### CT-008 - Tentar deletar reserva sem token de autenticacao

- Arquivo: `tests/api/specs/booking.delete.negative.spec.ts`
- Endpoint: `DELETE /booking/{bookingId}`
- Tipo: negativo

**Pre-condicoes**

- Uma reserva deve ser criada antes da tentativa de exclusao.
- Nenhum token de autenticacao deve ser enviado na requisicao de DELETE.

**Passos**

1. Criar uma reserva com payload valido.
2. Capturar o `bookingid` retornado.
3. Enviar requisicao `DELETE /booking/{bookingId}` sem token.
4. Validar o status code da resposta.
5. Consultar a reserva por ID.
6. Validar que a reserva permanece disponivel.

**Resultado esperado**

- A tentativa de exclusao deve retornar status `403`.
- A consulta posterior por ID deve retornar status `200`.
- A reserva nao deve ser excluida.

---

### CT-009 - Tentar deletar reserva com token invalido

- Arquivo: `tests/api/specs/booking.delete.negative.spec.ts`
- Endpoint: `DELETE /booking/{bookingId}`
- Tipo: negativo

**Pre-condicoes**

- Uma reserva deve ser criada antes da tentativa de exclusao.
- Um token invalido deve ser usado na requisicao de DELETE.

**Passos**

1. Criar uma reserva com payload valido.
2. Capturar o `bookingid` retornado.
3. Enviar requisicao `DELETE /booking/{bookingId}` com token invalido.
4. Validar o status code da resposta.

**Resultado esperado**

- A tentativa de exclusao deve retornar status `403`.
- A reserva nao deve ser excluida.


---

### CT-010 - Consultar reserva por ID inexistente

- Arquivo: `tests/api/specs/booking.get-by-id.negative.spec.ts`
- Endpoint: `GET /booking/{bookingId}`
- Tipo: negativo

**Pre-condicoes**

- Deve ser usado um ID sem reserva associada.

**Passos**

1. Definir um ID de reserva inexistente.
2. Enviar requisicao `GET /booking/{bookingId}`.
3. Validar o status code da resposta.

**Resultado esperado**

- A consulta deve retornar status `404`.

---

### CT-011 - Tentar atualizar reserva sem token de autenticacao

- Arquivo: `tests/api/specs/booking.put.negative.spec.ts`
- Endpoint: `PUT /booking/{bookingId}`
- Tipo: negativo

**Pre-condicoes**

- Uma reserva deve ser criada antes da tentativa de atualizacao.
- Nenhum token de autenticacao deve ser enviado na requisicao de PUT.

**Passos**

1. Criar uma reserva com payload valido.
2. Capturar o `bookingid` retornado.
3. Montar payload valido com dados atualizados.
4. Enviar requisicao `PUT /booking/{bookingId}` sem token.
5. Validar o status code da resposta.
6. Consultar a reserva por ID.
7. Validar que os dados originais foram preservados.

**Resultado esperado**

- A tentativa de atualizacao deve retornar status `403`.
- A consulta posterior por ID deve retornar status `200`.
- A reserva deve permanecer com os dados originais.

---

### CT-012 - Tentar atualizar reserva com token invalido

- Arquivo: `tests/api/specs/booking.put.negative.spec.ts`
- Endpoint: `PUT /booking/{bookingId}`
- Tipo: negativo

**Pre-condicoes**

- Uma reserva deve ser criada antes da tentativa de atualizacao.
- Um token invalido deve ser usado na requisicao de PUT.

**Passos**

1. Criar uma reserva com payload valido.
2. Capturar o `bookingid` retornado.
3. Montar payload valido com dados atualizados.
4. Enviar requisicao `PUT /booking/{bookingId}` com token invalido.
5. Validar o status code da resposta.
6. Consultar a reserva por ID.
7. Validar que os dados originais foram preservados.

**Resultado esperado**

- A tentativa de atualizacao deve retornar status `403`.
- A consulta posterior por ID deve retornar status `200`.
- A reserva deve permanecer com os dados originais.

---

### CT-013 - Tentar criar token sem username

- Arquivo: `tests/api/specs/auth.post.negative.spec.ts`
- Endpoint: `POST /auth`
- Tipo: negativo

**Pre-condicoes**

- Payload de autenticacao sem `username` disponivel.

**Passos**

1. Montar payload contendo apenas `password`.
2. Enviar requisicao `POST /auth`.
3. Validar o status code da resposta.
4. Validar o tipo de conteudo da resposta.
5. Validar a mensagem de erro retornada pela API.

**Resultado esperado**

- A API deve retornar status `200`, conforme contrato atual da Restful Booker.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve conter `reason` igual a `Bad credentials`.

---

### CT-014 - Tentar criar token sem password

- Arquivo: `tests/api/specs/auth.post.negative.spec.ts`
- Endpoint: `POST /auth`
- Tipo: negativo

**Pre-condicoes**

- Payload de autenticacao sem `password` disponivel.

**Passos**

1. Montar payload contendo apenas `username`.
2. Enviar requisicao `POST /auth`.
3. Validar o status code da resposta.
4. Validar o tipo de conteudo da resposta.
5. Validar a mensagem de erro retornada pela API.

**Resultado esperado**

- A API deve retornar status `200`, conforme contrato atual da Restful Booker.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve conter `reason` igual a `Bad credentials`.

---

### CT-015 - Tentar criar token com body vazio

- Arquivo: `tests/api/specs/auth.post.negative.spec.ts`
- Endpoint: `POST /auth`
- Tipo: negativo

**Pre-condicoes**

- Payload de autenticacao vazio disponivel.

**Passos**

1. Enviar requisicao `POST /auth` com body vazio.
2. Validar o status code da resposta.
3. Validar o tipo de conteudo da resposta.
4. Validar a mensagem de erro retornada pela API.

**Resultado esperado**

- A API deve retornar status `200`, conforme contrato atual da Restful Booker.
- A resposta deve conter `content-type` com `application/json`.
- O corpo da resposta deve conter `reason` igual a `Bad credentials`.

---

### CT-016 - Tentar criar reserva sem firstname

- Arquivo: `tests/api/specs/booking.post.negative.spec.ts`
- Endpoint: `POST /booking`
- Tipo: negativo

**Pre-condicoes**

- Payload de reserva sem `firstname` disponivel.

**Passos**

1. Montar payload de reserva sem `firstname`.
2. Enviar requisicao `POST /booking`.
3. Validar o status code da resposta.

**Resultado esperado**

- A tentativa de criacao deve retornar status `500`, conforme comportamento atual esperado da Restful Booker para payload invalido.

---

### CT-017 - Tentar criar reserva sem bookingdates

- Arquivo: `tests/api/specs/booking.post.negative.spec.ts`
- Endpoint: `POST /booking`
- Tipo: negativo

**Pre-condicoes**

- Payload de reserva sem `bookingdates` disponivel.

**Passos**

1. Montar payload de reserva sem `bookingdates`.
2. Enviar requisicao `POST /booking`.
3. Validar o status code da resposta.

**Resultado esperado**

- A tentativa de criacao deve retornar status `500`, conforme comportamento atual esperado da Restful Booker para payload invalido.

---

### CT-018 - Tentar criar reserva com body vazio

- Arquivo: `tests/api/specs/booking.post.negative.spec.ts`
- Endpoint: `POST /booking`
- Tipo: negativo

**Pre-condicoes**

- Payload de reserva vazio disponivel.

**Passos**

1. Enviar requisicao `POST /booking` com body vazio.
2. Validar o status code da resposta.

**Resultado esperado**

- A tentativa de criacao deve retornar status `500`, conforme comportamento atual esperado da Restful Booker para payload invalido.
## Observacoes

- Os cenarios de consulta, atualizacao e exclusao criam dados durante a execucao, evitando dependencia de IDs fixos.
- O comportamento de autenticacao invalida segue o contrato atual da Restful Booker, que retorna status `200` com `reason: Bad credentials`.
- Os cenarios negativos de payload em `POST /booking` validam o comportamento esperado da Restful Booker para payloads invalidos. Como a API publica pode mudar, esses status devem ser confirmados durante a execucao da suite.
