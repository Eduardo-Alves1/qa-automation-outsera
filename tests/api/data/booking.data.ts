import type {
  Booking,
  BookingDates
} from '../models/booking.model';

type BookingOverrides = Omit<Partial<Booking>, 'bookingdates'> & {
  bookingdates?: Partial<BookingDates>;
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function dateFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function createBookingData(
  overrides: BookingOverrides = {}
): Booking {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const booking: Booking = {
    firstname: `Test${suffix.slice(-6)}`,
    lastname: `User${suffix.slice(-6)}`,
    totalprice: Math.floor(Math.random() * 401) + 100,
    depositpaid: true,
    bookingdates: {
      checkin: dateFromToday(10),
      checkout: dateFromToday(15)
    },
    additionalneeds: `Automation ${suffix.slice(-6)}`
  };

  return {
    ...booking,
    ...overrides,
    bookingdates: {
      ...booking.bookingdates,
      ...overrides.bookingdates
    }
  };
}
