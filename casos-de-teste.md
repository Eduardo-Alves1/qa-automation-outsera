# Casos de Teste - API

A suíte de API foi consolidada por recurso para evitar crescimento excessivo de arquivos conforme novos endpoints e cenários forem adicionados.

## Estrutura

```text
tests/api/specs/
├── auth.spec.ts
└── booking.spec.ts
```

Os cenários continuam separados por endpoint através de `test.describe`, preservando leitura, tags e rastreabilidade sem criar um arquivo para cada combinação de verbo e cenário.

## Cobertura

| ID | Arquivo | Endpoint | Cenário | Resultado esperado |
|---|---|---|---|---|
| CT-001 | `auth.spec.ts` | `POST /auth` | Credenciais válidas | `200`, JSON e token válido |
| CT-002 | `auth.spec.ts` | `POST /auth` | Credenciais inválidas | `200` com `Bad credentials` |
| CT-003 | `auth.spec.ts` | `POST /auth` | Username ausente | `200` com `Bad credentials` |
| CT-004 | `auth.spec.ts` | `POST /auth` | Password ausente | `200` com `Bad credentials` |
| CT-005 | `auth.spec.ts` | `POST /auth` | Body vazio | `200` com `Bad credentials` |
| CT-006 | `booking.spec.ts` | `GET /booking` | Listar reservas | `200`, JSON e lista |
| CT-007 | `booking.spec.ts` | `GET /booking/{id}` | Consultar reserva criada | `200` e body igual ao payload criado |
| CT-008 | `booking.spec.ts` | `GET /booking/{id}` | ID inexistente | `404` |
| CT-009 | `booking.spec.ts` | `POST /booking` | Criar reserva válida | `200`, JSON, `bookingid` e body esperado |
| CT-010 | `booking.spec.ts` | `POST /booking` | Firstname ausente | `500` conforme contrato observado |
| CT-011 | `booking.spec.ts` | `POST /booking` | Bookingdates ausente | `500` conforme contrato observado |
| CT-012 | `booking.spec.ts` | `POST /booking` | Body vazio | `500` conforme contrato observado |
| CT-013 | `booking.spec.ts` | `POST /booking` | JSON malformado | `400` |
| CT-014 | `booking.spec.ts` | `POST /booking/{id}` | Método não suportado | `404` ou `405` |
| CT-015 | `booking.spec.ts` | `PUT /booking/{id}` | Atualização válida | `200` e persistência confirmada via GET |
| CT-016 | `booking.spec.ts` | `PUT /booking/{id}` | Sem token | `403` e dados originais preservados |
| CT-017 | `booking.spec.ts` | `PUT /booking/{id}` | Token inválido | `403` e dados originais preservados |
| CT-018 | `booking.spec.ts` | `DELETE /booking/{id}` | Exclusão válida | `201`, `Created` e GET posterior `404` |
| CT-019 | `booking.spec.ts` | `DELETE /booking/{id}` | Sem token | `403` e reserva preservada |
| CT-020 | `booking.spec.ts` | `DELETE /booking/{id}` | Token inválido | `403` e reserva preservada |

## Organização por tags

```text
@api @auth @booking
@get @post @put @delete
@positive @negative
@smoke @regression
```

Essa organização permite filtrar por recurso, verbo ou finalidade sem depender do nome do arquivo.
