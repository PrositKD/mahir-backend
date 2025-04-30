import { Schema, model } from 'mongoose';
import { TEventBooking } from './event-booking.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { generateTicketID } from '../../utils/helpers';
import { number } from 'zod';

const schema = new Schema<TEventBooking>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'payment',
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'event',
            required: true,
        },
        amount: Number,
        ticket: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);

schema.pre('save', async function (next: any): Promise<void> {
    if (!this.isModified('ticket')) {
        this.ticket = await generateTicketID('TICKET-');
    }
    next();
});

const EventBooking = model<TEventBooking, any>('event_booking', schema);
export default EventBooking;
