import { Types } from 'mongoose';
import { EventBookingSevice } from './event-booking.sevice';
import { PaymentService } from '../payment/payment.service';

export const EventBookingUpdateDB = async (
    bookingId: Types.ObjectId | string,
) => {
    const event = await EventBookingSevice.findEventBookingByQuery(
        { _id: bookingId },
        {},
        '',
        false,
    );
    if (event) {
        // await EventBookingSevice.updateEventBookingByQuery(
        //     { _id: bookingId },
        //     { status: 'active' },
        // );
        await PaymentService.updatePaymentByQuery(
            { _id: event.payment },
            { status: 'paid' },
        );
    }
};
