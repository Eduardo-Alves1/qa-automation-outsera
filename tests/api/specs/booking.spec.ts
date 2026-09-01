import { test, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { BookingClient } from '../clients/booking.client';
import { createValidAuthData } from '../data/auth.data';
import { createBookingData } from '../data/booking.data';
import type { AuthResponse } from '../models/auth.model';
import type {
  Booking,
  CreateBookingResponse
} from '../models/booking.model';

test.describe(
  'Booking API',
  { tag: ['@api', '@booking'] },
  () => {
    let authClient: AuthClient;
    let bookingClient: BookingClient;

    test.beforeEach(async ({ request }) => {
      authClient = new AuthClient(request);
      bookingClient = new BookingClient(request);
    });

    async function createBooking(
      bookingData: Booking = createBookingData()
    ): Promise<CreateBookingResponse> {
      const response = await bookingClient.createBooking(bookingData);

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type'])
        .toContain('application/json');

      const body: CreateBookingResponse = await response.json();
      expect(body.bookingid).toBeDefined();

      return body;
    }

    async function createAuthToken(): Promise<string> {
      const response = await authClient.createAuthToken(
        createValidAuthData()
      );

      expect(response.status()).toBe(200);

      const body: AuthResponse = await response.json();
      expect(body.token).toBeDefined();
      expect(body.token.length).toBeGreaterThan(0);

      return body.token;
    }

    test.describe(
      'GET /booking',
      { tag: ['@get'] },
      () => {
        test(
          'deve retornar a lista de reservas com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const response = await bookingClient.getAllBookings();

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
          }
        );
      }
    );

    test.describe(
      'GET /booking/{id}',
      { tag: ['@get'] },
      () => {
        test(
          'deve retornar uma reserva pelo ID com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const bookingData = createBookingData();
            const created = await createBooking(bookingData);

            const response = await bookingClient.getBookingById(
              created.bookingid
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body: Booking = await response.json();
            expect(body).toEqual(bookingData);
          }
        );

        test(
          'deve retornar 404 para um ID inexistente',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await bookingClient.getBookingById(
              Date.now()
            );

            expect(response.status()).toBe(404);
          }
        );
      }
    );

    test.describe(
      'POST /booking',
      { tag: ['@post'] },
      () => {
        test(
          'deve criar uma reserva com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const bookingData = createBookingData();
            const response = await bookingClient.createBooking(bookingData);

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body: CreateBookingResponse = await response.json();

            expect(body.bookingid).toBeDefined();
            expect(body.bookingid).toBeGreaterThan(0);
            expect(body.booking).toEqual(bookingData);
          }
        );

        test(
          'deve rejeitar uma reserva sem firstname',
          { tag: ['@negative', '@regression'] },
          async () => {
            const { firstname: _firstname, ...payload } = createBookingData();
            const response = await bookingClient.createBooking(payload);

            expect(response.status()).toBe(500);
          }
        );

        test(
          'deve rejeitar uma reserva sem bookingdates',
          { tag: ['@negative', '@regression'] },
          async () => {
            const { bookingdates: _bookingdates, ...payload } = createBookingData();
            const response = await bookingClient.createBooking(payload);

            expect(response.status()).toBe(500);
          }
        );

        test(
          'deve rejeitar uma reserva com body vazio',
          { tag: ['@negative', '@regression'] },
          async () => {
            const response = await bookingClient.createBooking({});

            expect(response.status()).toBe(500);
          }
        );

        test(
          'deve rejeitar payload JSON malformado',
          { tag: ['@negative', '@regression'] },
          async () => {
            const validPayload = JSON.stringify(createBookingData());
            const malformedPayload = validPayload.slice(0, -1);

            const response = await bookingClient.createBookingWithRawPayload(
              malformedPayload
            );

            expect(response.status()).toBe(400);
            expect(response.ok()).toBeFalsy();
          }
        );
      }
    );

    test.describe(
      'POST /booking/{id}',
      { tag: ['@post'] },
      () => {
        test(
          'deve rejeitar método não suportado para o recurso',
          { tag: ['@negative', '@regression'] },
          async () => {
            const created = await createBooking();

            const response = await bookingClient.requestBookingByIdWithMethod(
              created.bookingid,
              'POST'
            );

            expect(response.ok()).toBeFalsy();
            expect([404, 405]).toContain(response.status());
          }
        );
      }
    );

    test.describe(
      'PUT /booking/{id}',
      { tag: ['@put'] },
      () => {
        test(
          'deve atualizar uma reserva com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const originalBooking = createBookingData();
            const created = await createBooking(originalBooking);
            const token = await createAuthToken();

            const updatedBooking = createBookingData({
              ...originalBooking,
              totalprice: originalBooking.totalprice + 50,
              additionalneeds: `Updated ${Date.now()}`
            });

            const response = await bookingClient.updateBooking(
              created.bookingid,
              updatedBooking,
              token
            );

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type'])
              .toContain('application/json');

            const body: Booking = await response.json();
            expect(body).toEqual(updatedBooking);

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );

            expect(getResponse.status()).toBe(200);
            expect(await getResponse.json()).toEqual(updatedBooking);
          }
        );

        test(
          'deve rejeitar atualização sem token',
          { tag: ['@negative', '@regression'] },
          async () => {
            const originalBooking = createBookingData();
            const created = await createBooking(originalBooking);
            const updatedBooking = createBookingData({
              ...originalBooking,
              totalprice: originalBooking.totalprice + 50
            });

            const response = await bookingClient.updateBooking(
              created.bookingid,
              updatedBooking
            );

            expect(response.status()).toBe(403);

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );
            expect(getResponse.status()).toBe(200);
            expect(await getResponse.json()).toEqual(originalBooking);
          }
        );

        test(
          'deve rejeitar atualização com token inválido',
          { tag: ['@negative', '@regression'] },
          async () => {
            const originalBooking = createBookingData();
            const created = await createBooking(originalBooking);
            const updatedBooking = createBookingData({
              ...originalBooking,
              totalprice: originalBooking.totalprice + 50
            });

            const response = await bookingClient.updateBooking(
              created.bookingid,
              updatedBooking,
              `invalid-token-${Date.now()}`
            );

            expect(response.status()).toBe(403);

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );
            expect(getResponse.status()).toBe(200);
            expect(await getResponse.json()).toEqual(originalBooking);
          }
        );
      }
    );

    test.describe(
      'DELETE /booking/{id}',
      { tag: ['@delete'] },
      () => {
        test(
          'deve deletar uma reserva com sucesso',
          { tag: ['@positive', '@smoke', '@regression'] },
          async () => {
            const created = await createBooking();
            const token = await createAuthToken();

            const response = await bookingClient.deleteBooking(
              created.bookingid,
              token
            );

            expect(response.status()).toBe(201);
            expect(response.headers()['content-type'])
              .toContain('text/plain');
            expect(await response.text()).toBe('Created');

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );
            expect(getResponse.status()).toBe(404);
          }
        );

        test(
          'deve rejeitar exclusão sem token',
          { tag: ['@negative', '@regression'] },
          async () => {
            const created = await createBooking();

            const response = await bookingClient.deleteBooking(
              created.bookingid
            );

            expect(response.status()).toBe(403);

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );
            expect(getResponse.status()).toBe(200);
          }
        );

        test(
          'deve rejeitar exclusão com token inválido',
          { tag: ['@negative', '@regression'] },
          async () => {
            const created = await createBooking();

            const response = await bookingClient.deleteBooking(
              created.bookingid,
              `invalid-token-${Date.now()}`
            );

            expect(response.status()).toBe(403);

            const getResponse = await bookingClient.getBookingById(
              created.bookingid
            );
            expect(getResponse.status()).toBe(200);
          }
        );
      }
    );
  }
);
