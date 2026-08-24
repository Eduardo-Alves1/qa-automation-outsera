import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { AuthClient } from '../clients/auth.client';
import { createValidBookingDataModel, createUpdatedBookingDataModel } from '../data/booking.data';
import { createValidAuthData } from '../data/auth.data';
import type { Booking, CreateBookingResponse } from '../models/booking.model';
import type { AuthResponse } from '../models/auth.model';


test.describe('Booking API - DELETE', () => {

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
        const createBody: CreateBookingResponse =
            await createResponse.json();
        bookingId = createBody.bookingid;
    });

    test(
        'deve deletar uma reserva com sucesso',
        async () => {
            const response =
                await bookingClient.deleteBooking(
                    bookingId,
                    token
                );
            expect(response.status()).toBe(201);
            // Verificação se a reserva foi realmente deletada
            const getResponse =
                await bookingClient.getBookingById(
                    bookingId
                );
            expect(getResponse.status()).toBe(404);
        }
    );
});