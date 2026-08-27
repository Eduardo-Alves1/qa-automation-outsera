import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { AuthClient } from '../clients/auth.client';
import { createValidBookingDataModel } from '../data/booking.data';
import { createValidAuthData } from '../data/auth.data';
import type { CreateBookingResponse } from '../models/booking.model';
import type { AuthResponse } from '../models/auth.model';

test.describe(
    'Booking API - DELETE',
    {
        tag: ['@api', '@booking', '@delete']
    },
    () => {

        let bookingClient: BookingClient;
        let authClient: AuthClient;
        let bookingId: number;
        let token: string;

        test.beforeEach(async ({ request }) => {

            bookingClient =
                new BookingClient(request);

            authClient =
                new AuthClient(request);

            // Autenticação
            const authResponse =
                await authClient.createAuthToken(
                    createValidAuthData()
                );

            expect(authResponse.status()).toBe(200);

            const authBody: AuthResponse =
                await authResponse.json();

            expect(authBody.token).toBeDefined();
            expect(authBody.token).not.toBe('');

            token = authBody.token;

            // Criação da reserva
            const bookingData =
                createValidBookingDataModel();

            const createResponse =
                await bookingClient.createBooking(
                    bookingData
                );

            expect(createResponse.status()).toBe(200);

            const createBody: CreateBookingResponse =
                await createResponse.json();

            expect(createBody.bookingid).toBeDefined();

            bookingId = createBody.bookingid;
        });

        test(
            'deve deletar uma reserva com sucesso',
            {
                tag: ['@positive', '@smoke', '@regression']
            },
            async () => {
                const response =
                    await bookingClient.deleteBooking(
                        bookingId,
                        token
                    );

                expect(response.status()).toBe(201);

                expect(
                    response.headers()['content-type']
                ).toContain('text/plain');

                const responseBody =
                    await response.text();

                expect(responseBody).toBe('Created');

                // Verifica o efeito da operação por consulta posterior.
                const getResponse =
                    await bookingClient.getBookingById(
                        bookingId
                    );

                expect(getResponse.status()).toBe(404);
            }
        );
    }
);
