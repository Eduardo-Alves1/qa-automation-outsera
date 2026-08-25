import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { createValidBookingDataModel } from '../data/booking.data';
import type { CreateBookingResponse } from '../models/booking.model';

test.describe(
    'Booking API - POST',
    {
        tag: ['@api', '@booking', '@post']
    },
    () => {

        let bookingClient: BookingClient;

        test.beforeEach(async ({ request }) => {
            bookingClient = new BookingClient(request);
        });

        test(
            'deve criar uma reserva com sucesso',
            {
                tag: ['@positive', '@smoke', '@regression']
            },
            async () => {

                const bookingData = createValidBookingDataModel();

                const response =
                    await bookingClient.createBooking(bookingData);

                expect(response.status()).toBe(200);

                expect(response.headers()['content-type'])
                    .toContain('application/json');

                const body: CreateBookingResponse =
                    await response.json();

                expect(body.bookingid).toBeDefined();

                expect(body.booking)
                    .toEqual(bookingData);
            }
        );
    }
);