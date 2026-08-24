export interface BookingDates{
    checkin: string;
    checkout: string;
}

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds: string;
}

export interface CreateBookingResponse {
    bookingid: number;
    booking: Booking;
}

//A ideia é termos tipagem forte no projeto em vez de trabalhar com objetos any