import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { createValidBookingDataModel } from '../data/booking.data';
import { CreateBookingResponse } from '../models/booking.model';

test.describe(
    'Booking API - Método HTTP Inválido',
    {
        tag: ['@api', '@booking']
    },
    () => {

        let bookingClient: BookingClient;

        test.beforeEach(async ({ request }) => {
            bookingClient =
                new BookingClient(request);
        });

        test(
            'deve rejeitar POST em /booking/{id}',
            {
                tag: ['@post', '@negative', '@regression']
            },
            async () => {
                const createResponse =
                    await bookingClient.createBooking(
                        createValidBookingDataModel()
                    );

                expect(createResponse.status()).toBe(200);

                const createBody: CreateBookingResponse =
                    await createResponse.json();

                const invalidMethodResponse =
                    await bookingClient.requestBookingByIdWithMethod(
                        createBody.bookingid,
                        'POST'
                    );

                expect(invalidMethodResponse.ok()).toBeFalsy();
                expect([404, 405])
                    .toContain(invalidMethodResponse.status());
            }
        );
    }
);