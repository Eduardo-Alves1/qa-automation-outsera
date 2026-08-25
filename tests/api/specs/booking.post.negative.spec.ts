import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import {
    createBookingDataWithoutBookingDates,
    createBookingDataWithoutFirstname,
    createEmptyBookingData
} from '../data/booking.data';

test.describe('Booking API - POST - Cenários Negativos', () => {

    let bookingClient: BookingClient;

    test.beforeEach(async ({ request }) => {
        bookingClient =
            new BookingClient(request);
    });

    test(
        'deve retornar 500 ao tentar criar uma reserva sem firstname',
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
        async () => {
            const response =
                await bookingClient.createBooking(
                    createEmptyBookingData()
                );

            expect(response.status()).toBe(500);
        }
    );
});