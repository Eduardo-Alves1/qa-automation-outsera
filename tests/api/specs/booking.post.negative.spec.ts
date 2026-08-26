import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import {
    createBookingDataWithoutBookingDates,
    createBookingDataWithoutFirstname,
    createEmptyBookingData
} from '../data/booking.data';

test.describe(
    'Booking API - POST - Cenários Negativos',
    {
        tag: ['@api', '@booking', '@post']
    },
    () => {

        let bookingClient: BookingClient;

        test.beforeEach(async ({ request }) => {
            bookingClient =
                new BookingClient(request);
        });

        test(
            'deve retornar 500 ao tentar criar uma reserva sem firstname',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const response =
                    await bookingClient.createBooking(
                        createBookingDataWithoutFirstname()
                    );

                expect(response.status()).toBe(500);
            }
        );

        test(
            'deve retornar 500 ao tentar criar uma reserva sem bookingdates',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const response =
                    await bookingClient.createBooking(
                        createBookingDataWithoutBookingDates()
                    );

                expect(response.status()).toBe(500);
            }
        );

        test(
            'deve retornar 500 ao tentar criar uma reserva com body vazio',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const response =
                    await bookingClient.createBooking(
                        createEmptyBookingData()
                    );

                expect(response.status()).toBe(500);
            }
        );

        test(
            'deve rejeitar payload JSON malformado',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const malformedPayload =
                    '{"firstname":"Eduardo","lastname":"Alves"';

                const response =
                    await bookingClient.createBookingWithRawPayload(
                        malformedPayload
                    );

                expect(response.status()).toBe(400);
                expect(response.ok()).toBeFalsy();
            }
        );
    }
);