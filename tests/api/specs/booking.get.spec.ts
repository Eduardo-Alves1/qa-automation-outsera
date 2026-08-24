import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';


test.describe('Booking API - GET', () => {

    let bookingClient: BookingClient;

    test.beforeEach(async ({request}) => {
        bookingClient = new BookingClient(request);
    });

    test('deve retornar a lista de reservas com sucesso', async () => {
        const response = await bookingClient.getAllBookings();
        expect(response.status()).toBe(200);

        expect(response.headers()['content-type']).toContain('application/json');
        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
    });
});
