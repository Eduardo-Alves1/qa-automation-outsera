import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { AuthClient } from '../clients/auth.client';
import { createValidBookingDataModel, createUpdatedBookingDataModel } from '../data/booking.data';
import { createValidAuthData } from '../data/auth.data';
import type { Booking, CreateBookingResponse } from '../models/booking.model';
import type { AuthResponse } from '../models/auth.model';



test.describe(
    'Booking API - PUT',
    {
        tag: ['@api', '@booking', '@put']
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

            bookingId = createBody.bookingid;
        });

        test(
            'deve atualizar uma reserva com sucesso',
            {
                tag: ['@positive', '@smoke', '@regression']
            },
            async () => {

                const updatedBookingData: Booking =
                    createUpdatedBookingDataModel();

                const response =
                    await bookingClient.updateBooking(
                        bookingId,
                        updatedBookingData,
                        token
                    );

                expect(response.status()).toBe(200);

                expect(
                    response.headers()['content-type']
                ).toContain('application/json');

                const body: Booking =
                    await response.json();

                expect(body)
                    .toEqual(updatedBookingData);
            }
        );
    }
);