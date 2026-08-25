import {
    APIRequestContext,
    APIResponse
} from '@playwright/test';

import { Booking } from '../models/booking.model';

export class BookingClient {

    constructor(private readonly request: APIRequestContext) {}

    async getAllBookings(): Promise<APIResponse> {
        return this.request.get('/booking');
    }

    async getBookingById(bookingId: number): Promise<APIResponse> {
        return this.request.get(`/booking/${bookingId}`);
    }

    async createBooking(bookingData: Booking): Promise<APIResponse> {
        return this.request.post('/booking', {
            data: bookingData
        });
    }

    async updateBooking(bookingId: number, bookingData: Booking, token: string): Promise<APIResponse> {
        return this.request.put(`/booking/${bookingId}`, {
            data: bookingData,
            headers: {
                'Cookie': `token=${token}`
            }
        });
    }

    async deleteBooking(bookingId: number, token?: string): Promise<APIResponse> {
        return this.request.delete(`/booking/${bookingId}`, {
            headers: token 
            ? {
                'Cookie': `token=${token}`
            } : {}
        
        });
    }
}