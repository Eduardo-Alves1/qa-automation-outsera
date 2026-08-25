import { test, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { createValidAuthData, createInvalidAuthData} from '../data/auth.data';
import type { AuthRequest } from '../models/auth.model';

test.describe(
    'Auth API - POST',
    {
        tag: ['@api', '@auth', '@post']
    },
    () => {

        let authClient: AuthClient;

        test.beforeEach(async ({ request }) => {
            authClient = new AuthClient(request);
        });

        test(
            'deve criar um token de autenticação com sucesso',
            {
                tag: ['@positive', '@smoke', '@regression']
            },
            async () => {
                const authData: AuthRequest = createValidAuthData();

                const response = await authClient.createAuthToken(authData);

                expect(response.status()).toBe(200);

                expect(response.headers()['content-type'])
                    .toContain('application/json');

                const body = await response.json();

                expect(body).toHaveProperty('token');
                expect(typeof body.token).toBe('string');
            }
        );

        test(
            'deve retornar erro ao criar token de autenticação com dados inválidos',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const invalidAuthData: AuthRequest = createInvalidAuthData();

                const response = await authClient.createAuthToken(invalidAuthData);

                expect(response.status()).toBe(200);
                expect(response.headers()['content-type'])
                    .toContain('application/json');
                const body = await response.json();

                expect(body.reason).toBe('Bad credentials');

                /** O teste foi implementado de acordo com o contrato atual da API.
                 * Embora semanticamente fosse comum esperar um HTTP 401/403 para credenciais inválidas,
                 * a Restful Booker retorna HTTP 200 e sinaliza a falha por meio do campo reason.**/
            }
        );
    }
);