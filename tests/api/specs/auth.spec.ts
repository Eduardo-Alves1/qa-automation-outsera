import { test, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import {
  createAuthDataWithoutPassword,
  createAuthDataWithoutUsername,
  createEmptyAuthData,
  createInvalidAuthData,
  createValidAuthData
} from '../data/auth.data';

test.describe(
  'Auth API',
  { tag: ['@api', '@auth'] },
  () => {
    let authClient: AuthClient;

    test.beforeEach(async ({ request }) => {
      authClient = new AuthClient(request);
    });

    test.describe(
      'POST /auth',
      { tag: ['@post'] },
      () => {
        test(
          'deve criar um token de autenticação com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const response = await authClient.createAuthToken(
              createValidAuthData()
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();

            expect(body.token).toBeDefined();
            expect(typeof body.token).toBe('string');
            expect(body.token.length).toBeGreaterThan(0);
          }
        );

        test(
          'deve rejeitar credenciais inválidas',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await authClient.createAuthToken(
              createInvalidAuthData()
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();
            expect(body.reason).toBe('Bad credentials');
          }
        );

        test(
          'deve rejeitar autenticação sem username',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await authClient.createAuthToken(
              createAuthDataWithoutUsername()
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();
            expect(body.reason).toBe('Bad credentials');
          }
        );

        test(
          'deve rejeitar autenticação sem password',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await authClient.createAuthToken(
              createAuthDataWithoutPassword()
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();
            expect(body.reason).toBe('Bad credentials');
          }
        );

        test(
          'deve rejeitar autenticação com body vazio',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await authClient.createAuthToken(
              createEmptyAuthData()
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();
            expect(body.reason).toBe('Bad credentials');
          }
        );
      }
    );
  }
);
