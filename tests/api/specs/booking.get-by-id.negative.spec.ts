import { test, expect} from '@playwright/test';
import { BookingClient } from '../clients/booking.client';


test.describe('Booking API - GET by ID - Cenários Negativos', () => {
    let bookingClient: BookingClient;

    test.beforeEach(async ({ request }) => {
        bookingClient =
            new BookingClient(request);
    });

    test(
        'deve retornar 404 ao tentar buscar uma reserva com ID inexistente',
        async () => {
            const nonExistentBookingId = 999999;
            const response =
                await bookingClient.getBookingById(
                    nonExistentBookingId
                );
            expect(response.status()).toBe(404);
        }
    );
});