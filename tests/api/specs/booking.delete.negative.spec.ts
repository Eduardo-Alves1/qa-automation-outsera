import { test, expect} from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { createValidBookingDataModel } from '../data/booking.data';
import type { CreateBookingResponse } from '../models/booking.model';

test.describe(
    'Booking API - DELETE - Cenários Negativos',
    {
        tag: ['@api', '@booking', '@delete']
    },
    () => {

        let bookingClient: BookingClient;
        let bookingId: number;

        test.beforeEach(async ({ request }) => {

            bookingClient =
                new BookingClient(request);
            const createResponse =
                await bookingClient.createBooking(
                    createValidBookingDataModel()
                );

            expect(createResponse.status()).toBe(200);

            const createBody: CreateBookingResponse =
                await createResponse.json();
            bookingId = createBody.bookingid;
        });

        test(
            'deve retornar 403 ao tentar deletar uma reserva sem token de autenticação',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const response =
                    await bookingClient.deleteBooking(
                        bookingId
                    );

                expect(response.status()).toBe(403);

                const getResponse =
                    await bookingClient.getBookingById(
                        bookingId
                    );

                expect(getResponse.status()).toBe(200);
            }
        );

        test(
            'deve retornar 403 ao tentar deletar uma reserva com token inválido',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const invalidToken = 'invalid_token';
                const response =
                    await bookingClient.deleteBooking(
                        bookingId,
                        invalidToken
                    );

                expect(response.status()).toBe(403);

                const getResponse =
                    await bookingClient.getBookingById(
                        bookingId
                    );

                expect(getResponse.status()).toBe(200);
            }
        );
    }
);