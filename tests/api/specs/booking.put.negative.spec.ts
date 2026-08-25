import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/booking.client';
import { createValidBookingDataModel, createUpdatedBookingDataModel } from '../data/booking.data';
import type { Booking, CreateBookingResponse } from '../models/booking.model';

test.describe(
    'Booking API - PUT - Cenários Negativos',
    {
        tag: ['@api', '@booking', '@put']
    },
    () => {

        let bookingClient: BookingClient;
        let bookingId: number;
        let originalBookingData: Booking;

        test.beforeEach(async ({ request }) => {

            bookingClient =
                new BookingClient(request);

            originalBookingData =
                createValidBookingDataModel();

            const createResponse =
                await bookingClient.createBooking(
                    originalBookingData
                );

            expect(createResponse.status()).toBe(200);

            const createBody: CreateBookingResponse =
                await createResponse.json();

            bookingId = createBody.bookingid;
        });

        test(
            'deve retornar 403 ao tentar atualizar uma reserva sem token de autenticação',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const updatedBookingData =
                    createUpdatedBookingDataModel();

                const response =
                    await bookingClient.updateBooking(
                        bookingId,
                        updatedBookingData
                    );

                expect(response.status()).toBe(403);

                const getResponse =
                    await bookingClient.getBookingById(
                        bookingId
                    );

                expect(getResponse.status()).toBe(200);

                const body: Booking =
                    await getResponse.json();

                expect(body)
                    .toEqual(originalBookingData);
            }
        );

        test(
            'deve retornar 403 ao tentar atualizar uma reserva com token inválido',
            {
                tag: ['@negative', '@regression']
            },
            async () => {
                const invalidToken = 'invalid_token';
                const updatedBookingData =
                    createUpdatedBookingDataModel();

                const response =
                    await bookingClient.updateBooking(
                        bookingId,
                        updatedBookingData,
                        invalidToken
                    );

                expect(response.status()).toBe(403);

                const getResponse =
                    await bookingClient.getBookingById(
                        bookingId
                    );

                expect(getResponse.status()).toBe(200);

                const body: Booking =
                    await getResponse.json();

                expect(body)
                    .toEqual(originalBookingData);
            }
        );
    }
);