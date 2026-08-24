import { Booking } from '../models/booking.model';

export function createValidBookingDataModel(): Booking {
    return {
        firstname: 'Eduardo',
        lastname: 'Alves',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
            checkin: '2023-01-01',
            checkout: '2023-01-02'
        },
        additionalneeds: 'Café da manhã'
    };
}

export function createUpdatedBookingDataModel(): Booking {
    return {
        firstname: 'Eduardo',
        lastname: 'Alves',
        totalprice: 200,
        depositpaid: true,
        bookingdates: {
            checkin: '2023-01-01',
            checkout: '2023-01-02'
        },
        additionalneeds: 'Almoço'
    };
}

//cada teste receberá um novo objeto e depois poderemos sobrescrever campos facilmente para cenários negativos.