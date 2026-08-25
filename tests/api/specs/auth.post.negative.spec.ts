import { test, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import {
    createAuthDataWithoutPassword,
    createAuthDataWithoutUsername,
    createEmptyAuthData
} from '../data/auth.data';

test.describe('Auth API - POST - Cenários Negativos', () => {

    let authClient: AuthClient;

    test.beforeEach(async ({ request }) => {
        authClient =
            new AuthClient(request);
    });

    test(
        'deve retornar erro ao criar token sem username',
        async () => {
            const response =
                await authClient.createAuthToken(
                    createAuthDataWithoutUsername()
                );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
                .toContain('application/json');

            const body =
                await response.json();

            expect(body.reason)
                .toBe('Bad credentials');
        }
    );

    test(
        'deve retornar erro ao criar token sem password',
        async () => {
            const response =
                await authClient.createAuthToken(
                    createAuthDataWithoutPassword()
                );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
                .toContain('application/json');

            const body =
                await response.json();

            expect(body.reason)
                .toBe('Bad credentials');
        }
    );

    test(
        'deve retornar erro ao criar token com body vazio',
        async () => {
            const response =
                await authClient.createAuthToken(
                    createEmptyAuthData()
                );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
                .toContain('application/json');

            const body =
                await response.json();

            expect(body.reason)
                .toBe('Bad credentials');
        }
    );
});