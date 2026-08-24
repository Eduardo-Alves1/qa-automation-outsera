import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { createValidBookingDataModel } from '../data/booking.data';
import type {
    Booking,
    CreateBookingResponse
} from '../models/booking.model';

test.describe('Booking API - GET by ID', () => {

    let bookingClient: BookingClient;
    let bookingId: number;
    let bookingDataModel: Booking;

    test.beforeEach(async ({ request }) => {

        bookingClient = new BookingClient(request);

        bookingDataModel = createValidBookingDataModel();

        const createResponse =
            await bookingClient.createBooking(bookingDataModel);

        expect(createResponse.status()).toBe(200);

        const createBody: CreateBookingResponse =
            await createResponse.json();

        bookingId = createBody.bookingid;
    });

    test('deve retornar uma reserva pelo ID com sucesso', async () => {

        const response =
            await bookingClient.getBookingById(bookingId);

        expect(response.status()).toBe(200);

        expect(response.headers()['content-type'])
            .toContain('application/json');

        const body: Booking = await response.json();

        expect(body).toEqual(bookingDataModel);
    });
});